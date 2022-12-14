//determines if the user has a set theme
function detectColorScheme() {
  var theme = "light"; //default to light

  //local storage is used to override OS theme settings
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") == "dark") {
      var theme = "dark";
    }
  } else if (!window.matchMedia) {
    //matchMedia method not supported
    return false;
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    //OS theme setting detected as dark
    var theme = "dark";
  }

  //dark theme preferred, set document with a `data-theme` attribute
  if (theme == "dark") {
    document.documentElement.setAttribute("dataTheme", "dark");
  }
}
detectColorScheme();

//identify the toggle switch HTML element
const toggleSwitch = document.querySelector(".color-theme");
let darkmode = false;

//function that changes the theme, and sets a localStorage variable to track the theme between page loads
function switchTheme(e) {
  if (darkmode) {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("dataTheme", "light");
    darkmode = false;
  } else {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("dataTheme", "dark");
    darkmode = true;
  }
}

//listener for changing themes
toggleSwitch.addEventListener("click", switchTheme, false);

toggleSwitch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    switchTheme();
  }
});

//pre-check the dark-theme checkbox if dark-theme is set
if (document.documentElement.getAttribute("dataTheme") == "dark") {
  darkmode = true;
}

//pre-check the dark-theme checkbox if dark-theme is set
if (document.documentElement.getAttribute("dataTheme") == "dark") {
  darkmode = true;
}
