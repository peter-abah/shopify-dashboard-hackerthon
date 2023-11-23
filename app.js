"use strict";

function app() {
  const alertsBtn = document.getElementById("alerts-btn");
  const alertsContainer = document.getElementById("alerts");
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const popups = [alertsContainer, menu];

  const callout = document.getElementById("callout");
  const calloutCloseBtn = document.getElementById("callout-close-btn");

  const toggleSetupBtn = document.getElementById("toggle-setup-btn");
  const onboardingStepsList = document.getElementById("onboarding-steps");
  const toggleOnboardingStepVisibiltyBtns = document.querySelectorAll(".onboarding-step-toggle");
  const onboardingSteps = document.querySelectorAll(".onboarding-steps li");

  const toggleOnboardingStepCompleteBtns = document.querySelectorAll(".check-step-btn");
  const progressbar = document.getElementById("progess-bar");
  const progressCount = document.getElementById("progress-count");

  function togglePopups(event, popupBtn, popupBtnIndex) {
    popups.forEach((popup, popupIndex) => {
      if (popupBtnIndex === popupIndex) {
        return;
      }
      popup.classList.add("hidden");
    });

    popups[popupBtnIndex].classList.toggle("hidden");
    const isPopupOpen = !popups[popupBtnIndex].classList.contains("hidden");
    popupBtn.setAttribute("aria-expanded", isPopupOpen);
    if (isPopupOpen) {
      event.stopPropagation();
    }
  }

  function hidePopupsOnClickOutside(event) {
    popups.forEach((element) => {
      if (!element || element.contains(event.target)) {
        return;
      }

      element.classList.add("hidden");
    });
  }

  function toggleSetup() {
    onboardingStepsList.classList.toggle("hidden");

    const isOpen = !onboardingStepsList.classList.contains("hidden");
    toggleSetupBtn.setAttribute("aria-expanded", isOpen);
    toggleSetupBtn.dataset.isOpen = isOpen ? "" : true;
  }

  function showOnboardingStep(onboardingStepIndex) {
    onboardingSteps.forEach((el) => el.classList.remove("active"));
    onboardingSteps.item(onboardingStepIndex).classList.add("active");
  }

  function toggleOnboardingStepComplete(toggleBtnIndex) {
    const onboardingStep = onboardingSteps.item(toggleBtnIndex);
    onboardingStep.dataset.isCompleted = onboardingStep.dataset.isCompleted ? "" : true;

    updateProgressBar();

    const nextStepIndex = findNextUncompletedStepIndex(onboardingSteps);
    if (nextStepIndex != -1) {
      showOnboardingStep(onboardingSteps, nextStepIndex);
    }
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

  alertsBtn.addEventListener("click", (event) => togglePopups(event, alertsBtn, 0));
  menuBtn.addEventListener("click", (event) => togglePopups(event, menuBtn, 1));
  document.addEventListener("click", hidePopupsOnClickOutside);

  calloutCloseBtn.addEventListener("click", () => {
    callout.classList.add("hidden");
  });

  toggleSetupBtn.addEventListener("click", toggleSetup);
  toggleOnboardingStepVisibiltyBtns.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => showOnboardingStep(btnIndex));
  });

  toggleOnboardingStepCompleteBtns.forEach((btn, btnIndex) => {
    btn.addEventListener("click", () => toggleOnboardingStepComplete(btnIndex));
  });
}

app();
