"use strict";

const alertsBtn = document.getElementById("alerts-btn");
const alertsContainer = document.getElementById("alerts");
const navMenuBtn = document.getElementById("nav-menu-btn");
const navMenu = document.getElementById("nav-menu");
const popups = [alertsContainer, navMenu];
const popupBtns = [alertsBtn, navMenuBtn];
const callout = document.getElementById("callout");
const calloutCloseBtn = document.getElementById("callout-close-btn");
const toggleSetupBtn = document.getElementById("toggle-setup-btn");
const onboardingStepsList = document.getElementById("onboarding-steps");
const onboardingStepToggleBtns = [...document.getElementsByClassName("onboarding-step-toggle")];
const onboardingSteps = [...document.querySelectorAll(".onboarding-steps li")];
const checkStepBtns = [...document.getElementsByClassName("check-step-btn")];
const progressbar = document.getElementById("progess-bar");
const progressCount = document.getElementById("progress-count");

addEventListenerForPopups();
hideOnClickOutside();

calloutCloseBtn.addEventListener("click", () => {
  callout.classList.add("hidden");
});


toggleSetupBtn.addEventListener("click", () => {
  onboardingStepsList.classList.toggle("hidden");
  toggleSetupBtn.dataset.isOpen = toggleSetupBtn.dataset.isOpen ? '' : true;
});

onboardingStepToggleBtns.forEach((btn, index) => {
  btn.addEventListener("click", (e) => {
    showOnboardingStep(onboardingSteps, index);
  });
});

checkStepBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const onboardingStep = onboardingSteps[index];
    onboardingStep.dataset.isCompleted = onboardingStep.dataset.isCompleted ? "" : true;

    // [...btn.children].forEach((el) => el.classList.toggle("hidden"));
    updateProgressBar();

    const nextStepIndex = findNextUncompletedStepIndex(onboardingSteps);
    if (nextStepIndex != -1) {
      showOnboardingStep(onboardingSteps, nextStepIndex);
    }
  });
});

function addEventListenerForPopups() {
  popupBtns.forEach((btn, index) => {
    btn.addEventListener("click", (event) => {
      popups.forEach((popup, popupIndex) => {
        if ((index === popupIndex)) return;

        popup.classList.add("hidden");
      });

      popups[index].classList.toggle("hidden");
      btn.setAttribute('aria-expanded', !popups[index].classList.contains('hidden'))
      if (!popups[index].classList.contains("hidden")) {
        event.stopPropagation();
      }
    });
  });
}

function hideOnClickOutside() {
  document.addEventListener("click", (event) => {
    popups.forEach((element) => {
      if (!element || element.contains(event.target)) {
        return;
      }

      element.classList.add("hidden");
    });
  });
}

function showOnboardingStep(onboardingSteps, index) {
  onboardingSteps.forEach((el) => el.classList.remove("active"));
  onboardingSteps[index].classList.add("active");
}

function findNextUncompletedStepIndex(onboardingSteps) {
  const nextStepIndex = onboardingSteps.findIndex((step) => !step.dataset.isCompleted);
  return nextStepIndex;
}

function updateProgressBar() {
  const completedStepsNo = onboardingSteps.filter((step) => step.dataset.isCompleted).length;
  progressbar.style.width = `${completedStepsNo * 20}%`;
  progressCount.innerText = completedStepsNo;
}
