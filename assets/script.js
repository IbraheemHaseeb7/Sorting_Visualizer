const MIN_SIZE = 4;
const MAX_SIZE = 64;
const DEFAULT_SIZE = 32;

const MIN_SPEED = 1;
const MAX_SPEED = 4;
const DEFAULT_SPEED = 3;

const MIN = 20;
const MAX = 300;

const WAITING_TIME = 100;

const UNSORTED = "deepskyblue";
const SORTED = "mediumspringgreen";
const COMPARE = "crimson";
const SELECTED = "blueviolet";
const LEFT = "gold";
const RIGHT = "orangered";

const algo_data = [
  {
    name: "bubble",
    time: {
      worst: "O(n^2)",
      best: "O(n)",
      average: "O(n^2)",
      space: "O(1)",
      inversion: "O(n^2)",
    },
    pseudo: `
      bubble_sort(array):
      for i in range(len(array) - 1):
        for j in range(len(array) - i - 1):
          if array[j] > array[j + 1]:
            # Swap the two elements
            temp = array[j]
            array[j] = array[j + 1]
            array[j + 1] = temp
    
        if swapped == False:
          break
    
      return array`,
  },
  {
    name: "selection",
    time: {
      worst: "O(n^2)",
      best: "O(n^2)",
      average: "O(n^2)",
      space: "O(1)",
      inversion: "O(n^2)",
    },
    pseudo: `
    selection_sort(array):
    for i in range(len(array) - 1):
      smallest_index = i
      for j in range(i + 1, len(array)):
        if array[j] < array[smallest_index]:
          smallest_index = j
      temp = array[i]
      array[i] = array[smallest_index]
      array[smallest_index] = temp
  
    return array`,
  },
  {
    name: "insertion",
    time: {
      worst: "O(n^2)",
      best: "O(n)",
      average: "O(n^2)",
      space: "O(1)",
      inversion: "O(n^2)",
    },
    pseudo: `
    insertion_sort(array):
    for i in range(1, len(array)):
      current_element = array[i]
      j = i - 1
  
      while j >= 0 and array[j] > current_element:
        array[j + 1] = array[j]
        j -= 1
  
      array[j + 1] = current_element
  
    return array`,
  },
  {
    name: "merge",
    time: {
      worst: "O(n log n)",
      best: "O(n log n)",
      average: "O(n log n)",
      space: "O(n)",
      inversion: "O(n log n)",
    },
    pseudo: `
    merge_sort(array):
    if len(array) <= 1:
      return array

    # Divide the array into two halves
    mid = len(array) // 2
    left = array[:mid]
    right = array[mid:]

    # Recursively sort the two halves
    left = merge_sort(left)
    right = merge_sort(right)

    # Merge the two sorted halves
    sorted_array = []
    i = 0
    j = 0
    while i < len(left) and j < len(right):
      if left[i] <= right[j]:
        sorted_array.append(left[i])
        i += 1
      else:
        sorted_array.append(right[j])
        j += 1

    # Add any remaining elements from the 
    left or right arrays
    sorted_array.extend(left[i:])
    sorted_array.extend(right[j:])

    return sorted_array`,
  },
];

var size;
var delay;

var arr = [];

var array_container_width;
var element_width;
var element_width_max;
var margin_element;

var algo_selected;

function updateValues() {
  array_container_width = Math.floor($("#array-container").width());
  element_width_max = Math.floor(array_container_width / 20);

  margin_element = 2;
  if (parseInt($(window).width()) < 1200) margin_element = 1;
}

function findElementWidth() {
  element_width = Math.floor(array_container_width / size);
  element_width -= 2 * margin_element;

  if (element_width > element_width_max) element_width = element_width_max;
}

function createArray() {
  arr = [];
  $("#array").html("");

  for (var i = 0; i < size; i++) {
    var n = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
    arr.push(n);

    var $element = $("<div>");
    $element.attr("id", "e" + i);
    $element.attr("class", "element");
    $element.css("background-color", UNSORTED);
    $element.css("width", element_width.toString() + "px");
    $element.css("height", n.toString() + "px");
    $element.css("margin-left", margin_element + "px");
    $element.css("margin-right", margin_element + "px");
    $element.appendTo("#array");
  }
}

function setHeight(id, height) {
  $("#e" + id).css("height", height);
}

function setColor(id, color) {
  $("#e" + id).css("background-color", color);
}

function setColorRange(p, r, color) {
  for (var i = p; i <= r; i++) $("#e" + i).css("background-color", color);
}

function swap(a, b) {
  var temp = arr[a];
  arr[a] = arr[b];
  arr[b] = temp;

  var h1 = $("#e" + a).css("height");
  var h2 = $("#e" + b).css("height");

  setHeight(a, h2);
  setHeight(b, h1);
}

function disableOthers() {
  $("#sort").prop("disabled", true);
  $("#randomize").prop("disabled", true);
  $("#size-slider").prop("disabled", true);
}

function enableOthers() {
  $("#sort").prop("disabled", false);
  $("#randomize").prop("disabled", false);
  $("#size-slider").prop("disabled", false);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setAlogData(data) {
  $("#pseudo-code").html(data.pseudo);
  $("#worst").html(`Worst Case: ${data.time.worst}`);
  $("#best").html(`Best Case: ${data.time.best}`);
  $("#average").html(`Average Case${data.time.average}`);
  $("#space").html(`Space: ${data.time.space}`);
  $("#inversion").html(`Inversion: ${data.time.inversion}`);
}

$(document).ready(function () {
  $("#size-slider").attr("min", MIN_SIZE);
  $("#size-slider").attr("max", MAX_SIZE);
  $("#size-slider").attr("value", DEFAULT_SIZE);

  $("#speed-slider").attr("min", MIN_SPEED);
  $("#speed-slider").attr("max", MAX_SPEED);
  $("#speed-slider").attr("value", DEFAULT_SPEED);

  size = DEFAULT_SIZE;
  delay = WAITING_TIME * Math.pow(2, MAX_SPEED - DEFAULT_SPEED);

  updateValues();

  findElementWidth();
  createArray();

  $("#randomize").click(function () {
    createArray();
  });

  $(".algo-btn").click(function () {
    algo_selected = $(this).html();
    $(".about-algo").removeClass("hide-about-algo");
    switch (algo_selected) {
      case "Bubble Sort":
        setAlogData(algo_data[0]);
        break;
      case "Selection Sort":
        setAlogData(algo_data[1]);
        break;
      case "Insertion Sort":
        setAlogData(algo_data[2]);
        break;
      case "Merge Sort":
        setAlogData(algo_data[3]);
        break;
      default:
        break;
    }

    $(".algo-btn-active").removeClass("algo-btn-active");
    $(this).addClass("algo-btn-active");

    $("#no-algo-warning").removeClass("display-flex");
    $("#no-algo-warning").addClass("display-none");
  });

  $("#sort").click(async function () {
    disableOthers();

    setColorRange(0, size - 1, UNSORTED);

    if (algo_selected == "Bubble Sort") {
      await bubbleSort();
    } else if (algo_selected == "Selection Sort") {
      await selectionSort();
    } else if (algo_selected == "Insertion Sort") {
      await insertionSort();
    } else {
      $("#no-algo-warning").removeClass("display-none");
      $("#no-algo-warning").addClass("display-flex");
    }

    enableOthers();
  });

  $("#size-slider").on("input", function () {
    size = $(this).val();

    findElementWidth();
    createArray();
  });

  $("#speed-slider").on("inpt", function () {
    delay = WAITING_TIME * Math.pow(2, MAX_SPEED - $(this).val());
  });

  $(window).resize(function () {
    if (array_container_width != Math.floor($("#array-container").width())) {
      updateValues();

      findElementWidth();

      $("#no-algo-warning").removeClass("display-flex");
      $("#no-algo-warning").addClass("display-none");
    }
  });

  $("#sort").click(async function () {
    disableOthers();

    setColorRange(0, size - 1, UNSORTED);

    if (algo_selected == "Bubble Sort") await bubbleSort();
    else if (algo_selected == "Selection Sort") await selectionSort();
    else if (algo_selected == "Insertion Sort") await insertionSort();
    else if (algo_selected == "Merge Sort") await mergeSort();
    else {
      $("#no-algo-warning").removeClass("display-none");
      $("#no-algo-warning").addClass("display-flex");
    }

    enableOthers();
  });

  $("#size-slider").on("input", function () {
    size = $(this).val();

    findElementWidth();
    createArray();
  });

  $("#speed-slider").on("inpt", function () {
    delay = WAITING_TIME * Math.pow(2, MAX_SPEED - $(this).val());
  });

  $(window).resize(function () {
    if (array_container_width != Math.floor($("#array-container").width())) {
      updateValues();

      findElementWidth();

      for (var i = 0; i < size; i++) {
        $("#e" + i).css("width", element_width.toString() + "px");
        $("#e" + i).css("margin-left", margin_element + "px");
        $("#e" + i).css("margin-right", margin_element + "px");
      }
    }
  });
  for (var i = 0; i < size; i++) {
    $("#e" + i).css("width", element_width.toString() + "px");
    $("#e" + i).css("margin-left", margin_element + "px");
    $("#e" + i).css("margin-right", margin_element + "px");
  }
});
