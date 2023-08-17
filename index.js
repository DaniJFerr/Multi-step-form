$(document).ready(function() {

  // Selecting elements from the DOM
  const steps = $(".stp");
  const circleSteps = $(".step");
  const formInputs = $(".step-1 form input");
  const plans = $(".plan-card");
  const switcher = $(".switch");
  const addons = $(".box");
  const total = $(".total b");
  const planPrice = $(".plan-price");

  // Declaring variables
  let time;
  let currentStep = 1;
  let currentCircle = 0;
  const obj = {
    plan: null,
    kind: null,
    price: null
  };

  // Iterating through each step
  steps.each(function() {
    const nextBtn = $(this).find(".next-stp");
    const prevBtn = $(this).find(".prev-stp");

    // Adding click event listener to previous button
    if (prevBtn.length !== 0) {
      prevBtn.on("click", function() {
        // Hiding current step and updating values
        $(".step-" + currentStep).hide();
        currentStep--;
        $(".step-" + currentStep).css("display", "flex");
        circleSteps.eq(currentCircle).removeClass("active");
        currentCircle--;
      });
    }

    // Adding click event listener to next button
    nextBtn.on("click", function() {
      // Hiding current step and moving to next step if form is valid
      $(".step-" + currentStep).hide();
      if (currentStep < 5 && validateForm()) {
        currentStep++;
        currentCircle++;
        setTotal();
      }
      $(".step-" + currentStep).css("display", "flex");
      circleSteps.eq(currentCircle).addClass("active");
      summary(obj);
    });
  });

  // Function to update summary based on selected plan, kind, and price
  function summary(obj) {
    const planName = $(".plan-name");
    const planPrice = $(".plan-price");
    planPrice.html(`${obj.price.text()}`);
    planName.html(`${obj.plan.text()} (${obj.kind ? "yearly" : "monthly"})`);
  }

  // Function to validate form inputs
  function validateForm() {
    let valid = true;
    formInputs.each(function() {
      if (!$(this).val()) {
        valid = false;
        $(this).addClass("err");
        findLabel($(this)).next().css("display", "flex");
      } else {
        valid = true;
        $(this).removeClass("err");
        findLabel($(this)).next().css("display", "none");
      }
    });
    return valid;
  }

  // Function to find associated label for input element
  function findLabel(el) {
    const idVal = el.id;
    const labels = $("label");
    for (let i = 0; i < labels.length; i++) {
      if ($(labels[i]).attr("for") === idVal) {
        return $(labels[i]);
      }
    }
    return null;
  }

  // Click event listener for plans
  plans.each(function() {
    $(this).on("click", function() {
      $(".selected").removeClass("selected");
      $(this).addClass("selected");
      const planName = $(this).find("b");
      const planPrice = $(this).find(".plan-priced");
      obj.plan = planName;
      obj.price = planPrice;
    });
  });

  // Click event listener for switcher
  switcher.on("click", function() {
    const val = switcher.find("input").prop("checked");
    if (val) {
      $(".monthly").removeClass("sw-active");
      $(".yearly").addClass("sw-active");
    } else {
      $(".monthly").addClass("sw-active");
      $(".yearly").removeClass("sw-active");
    }
    switchPrice(val);
    obj.kind = val;
  });

  // Click event listener for addons
  addons.each(function(index, addon) {
    $(addon).on("click", function(e) {
      const addonSelect = $(addon).find("input");
      const ID = $(addon).attr("data-id");

      if (addonSelect.prop("checked")) {
        addonSelect.prop("checked", false);
        $(addon).removeClass("ad-selected");
        showAddon(ID, false);
      } else {
        addonSelect.prop("checked", true);
        $(addon).addClass("ad-selected");
        showAddon(addon, true);
        e.preventDefault();
      }
    });
  });

  // Function to switch prices based on yearly or monthly selection
  function switchPrice(checked) {
    const yearlyPrice = [90, 120, 150];
    const monthlyPrice = [9, 12, 15];
    const prices = $(".plan-priced");

    if (checked) {
      prices.eq(0).html(`$${yearlyPrice[0]}/yr`);
      prices.eq(1).html(`$${yearlyPrice[1]}/yr`);
      prices.eq(2).html(`$${yearlyPrice[2]}/yr`);
      setTime(true);
    } else {
      prices.eq(0).html(`$${monthlyPrice[0]}/mo`);
      prices.eq(1).html(`$${monthlyPrice[1]}/mo`);
      prices.eq(2).html(`$${monthlyPrice[2]}/mo`);
      setTime(false);
    }
  }

  // Function to show/hide selected addons in summary
  function showAddon(ad, val) {
    const temp = $("template")[0];
    const clone = temp.content.cloneNode(true);
    const serviceName = $(clone).find(".service-name");
    const servicePrice = $(clone).find(".servic-price");
    const serviceID = $(clone).find(".selected-addon");

    if (ad && val) {
      serviceName.text($(ad).find("label").text());
      servicePrice.text($(ad).find(".price").text());
      serviceID.attr("data-id", $(ad).attr("data-id"));
      $(".addons").append(clone);
    } else {
      const addons = $(".selected-addon");
      addons.each(function(index, addon) {
        const attr = $(addon).attr("data-id");
        if (attr === ad) {
          $(addon).remove();
        }
      });
    }
  }

  // Function to update total price in summary
  function setTotal() {
    const str = planPrice.html();
    const res = str.replace(/\D/g, "");
    const addonPrices = $(".selected-addon .servic-price");
    let val = 0;

    addonPrices.each(function(index, price) {
      const str = $(price).html();
      const res = str.replace(/\D/g, "");
      val += Number(res);
    });

    total.html(`$${val + Number(res)}/${time ? "yr" : "mo"}`);
  }

  // Function to set time variable
  function setTime(t) {
    return (time = t);
  }

});
