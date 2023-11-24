function app() {
  const alertsBtn = document.getElementById("alerts-btn");
  const alertsContainer = document.getElementById("alerts");
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const menuItems = document.querySelectorAll('[role="menuitem"]');
  const popups = [alertsContainer, menu];
  const popupBtns = [alertsBtn, menuBtn];

  const callout = document.getElementById("callout");
  const calloutCloseBtn = document.getElementById("callout-close-btn");

  const toggleSetupBtn = document.getElementById("toggle-setup-btn");
  const onboardingStepsList = document.getElementById("onboarding-steps");
  const toggleOnboardingStepVisibiltyBtns = document.querySelectorAll(".onboarding-step-toggle");
  const onboardingSteps = [...document.querySelectorAll(".onboarding-steps li")];

  const toggleOnboardingStepCompleteBtns = document.querySelectorAll(".check-step-btn");
  const progressbar = document.getElementById("progess-bar");
  const progressCount = document.getElementById("progress-count");

  function hidePopups() {
    popups.forEach((popup, index) => {
      popup.classList.add("hidden");
      popupBtns[index].setAttribute("aria-expanded", false);
    });
  }

  function togglePopup(event, popupBtn, popupBtnIndex) {
    const isPopupOpen = !popups[popupBtnIndex]?.classList.contains("hidden");
    hidePopups();

    if (!isPopupOpen) {
      popups[popupBtnIndex]?.classList.remove("hidden");
      popupBtn.setAttribute("aria-expanded", true);
      event.stopPropagation();
    }
  }

  function hidePopupsOnClickOutside(event) {
    const isAnyPopupClicked = popups.some((popup, popupIndex) => {
      return popup.contains(event.target);
    });
    if (isAnyPopupClicked) {
      return;
    }

    hidePopups();
  }

  function focusFirstMenuItem() {
    menuItems.item(0).focus();
  }

  function handleEscapeKeyPress(event) {
    if (event.key === "Escape") {
      hidePopups();
    }
  }

  function handleMenuItemKeyPress(event, menuItemIndex) {
    let nextMenuItemIndex;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextMenuItemIndex = modNumber(menuItemIndex + 1, menuItems.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      nextMenuItemIndex = modNumber(menuItemIndex - 1, menuItems.length);
    } else if (event.key === "Home") {
      nextMenuItemIndex = 0;
    } else if (event.key === "End") {
      nextMenuItemIndex = menuItems.length - 1;
    } else {
      return;
    }

    menuItems.item(nextMenuItemIndex).focus();
  }

  function toggleSetup() {
    onboardingStepsList.classList.toggle("hidden");

    const isOpen = !onboardingStepsList.classList.contains("hidden");
    toggleSetupBtn.setAttribute("aria-expanded", isOpen);
    toggleSetupBtn.dataset.isOpen = isOpen ? "" : true;
  }

  function showOnboardingStep(onboardingStepIndex) {
    hideOnboardingSteps();
    onboardingSteps[onboardingStepIndex].classList.add("active");
    toggleOnboardingStepVisibiltyBtns.item(onboardingStepIndex).setAttribute("aria-expanded", true);
  }

  function hideOnboardingSteps() {
    onboardingSteps.forEach((el) => el.classList.remove("active"));
    toggleOnboardingStepVisibiltyBtns.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  function toggleOnboardingStepComplete(toggleBtnIndex) {
    const onboardingStep = onboardingSteps[toggleBtnIndex];
    onboardingStep.dataset.isCompleted = onboardingStep.dataset.isCompleted ? "" : true;

    updateProgressBar();

    const nextStepIndex = findNextUncompletedStepIndex(onboardingSteps);
    if (nextStepIndex != -1) {
      showOnboardingStep(nextStepIndex);
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

  // Modulus function that works with negative numbers
  function modNumber(num, n) {
    return ((num % n) + n) % n;
  }

  alertsBtn.addEventListener("click", (event) => {
    togglePopup(event, alertsBtn, 0);
  });

  menuBtn.addEventListener("click", (event) => {
    togglePopup(event, menuBtn, 1);

    const isMenuOpen = !menu.classList.contains("hidden");
    if (isMenuOpen) {
      focusFirstMenuItem();
    }
  });

  popups.forEach((popup) => {
    popup.addEventListener("keyup", handleEscapeKeyPress);
  });
  alertsBtn.addEventListener('keyup', handleEscapeKeyPress)
  menuItems.forEach((menuItem, index) =>
    menuItem.addEventListener("keyup", (event) => handleMenuItemKeyPress(event, index))
  );

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
