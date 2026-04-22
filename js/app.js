(function () {
  "use strict";

  var AHASEND_API_KEY =
    "aha-sk-H5AgBORjt4cNnY2wlm0f5zor_WUq79DGQ6otJeZk5zO-tlCHWmw2qy_uVOyekcE0";
  var AHASEND_ACCOUNT_ID = "a6e36d35-3b76-48f3-a516-35ce876e6a75";
  var AHASEND_FROM_EMAIL = "contact@hello.velvetsvault.com";
  var AHASEND_TO_EMAIL = "velvetsvault@proton.me";
  var AHASEND_SUBJECT = "New cart inquiry - Velvets Vault";
  var FLOATING_TELEGRAM_USERNAME = "Jack2winn";

  var loadScreen = document.getElementById("load-screen");
  var splashVideo = document.getElementById("splash-video");
  var grid = document.getElementById("platform-grid");
  var modal = document.getElementById("buy-modal");
  var modalPlatform = document.getElementById("buy-modal-platform");
  var buyForm = document.getElementById("buy-form");
  var creditAmount = document.getElementById("credit-amount");
  var headerCartButton = document.getElementById("header-cart");
  var headerCartBadge = document.getElementById("header-cart-badge");
  var headerCartEmpty = document.getElementById("header-cart-empty");
  var cartModal = document.getElementById("cart-modal");
  var cartLines = document.getElementById("cart-lines");
  var cartContactForm = document.getElementById("cart-contact-form");
  var cartEmail = document.getElementById("cart-email");
  var cartMessage = document.getElementById("cart-message");
  var floatingTelegram = document.getElementById("floating-telegram");
  var floatingWhatsapp = document.getElementById("floating-whatsapp");
  var CART_STORAGE_KEY = "velvet-vault-cart";

  var selectedPlatform = null;
  var minSplashMs = 3000;
  var splashStart = Date.now();
  var cartBlinkTimer = null;
  var toastStack = null;

  function hideLoadScreen() {
    if (!loadScreen || loadScreen.classList.contains("is-done")) return;
    var elapsed = Date.now() - splashStart;
    var wait = Math.max(0, minSplashMs - elapsed);
    window.setTimeout(function () {
      loadScreen.classList.add("is-done");
      document.body.classList.remove("is-loading");
      loadScreen.setAttribute("aria-hidden", "true");
      try {
        if (splashVideo) {
          splashVideo.pause();
          splashVideo.removeAttribute("src");
          splashVideo.load();
        }
      } catch (_) {}
    }, wait);
  }

  function initSplash() {
    document.body.classList.add("is-loading");
    var done = false;
    function tryHide() {
      if (done) return;
      done = true;
      hideLoadScreen();
    }

    window.addEventListener("load", function () {
      window.setTimeout(tryHide, 400);
    });

    if (splashVideo) {
      splashVideo.addEventListener("error", tryHide);
      splashVideo.addEventListener("stalled", function () {
        window.setTimeout(tryHide, 2500);
      });
    }

    window.setTimeout(tryHide, 8000);
  }

  function logoPath(logo) {
    return "assets/" + logo;
  }

  var ICON_PLAY =
    '<svg class="platform-card__btn-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path fill="currentColor" d="M10.25 8.65L16.2 12l-5.95 3.35V8.65z"/></svg>';
  var ICON_HEADSET =
    '<svg class="platform-card__btn-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6"/><path stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>';
  var ICON_TELEGRAM =
    '<svg class="platform-card__btn-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5h2l1.2 8.2a2 2 0 0 0 2 1.7h7.9a2 2 0 0 0 2-1.6L20 8H7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.3" cy="18.6" r="1.4" fill="currentColor"/><circle cx="16.7" cy="18.6" r="1.4" fill="currentColor"/></svg>';

  function renderPlatforms(list) {
    if (!grid || !Array.isArray(list)) return;
    grid.innerHTML = "";
    list.forEach(function (p) {
      var card = document.createElement("article");
      card.className = "platform-card";
      card.setAttribute("data-name", p.name);

      var media = document.createElement("div");
      media.className = "platform-card__media";

      if (!p.logo) {
        media.appendChild(heroFallback(p.name));
      } else {
        var img = document.createElement("img");
        img.className = "platform-card__hero-img";
        img.alt = "";
        img.loading = "lazy";
        img.src = logoPath(p.logo);
        img.addEventListener("error", function onErr() {
          img.removeEventListener("error", onErr);
          img.replaceWith(heroFallback(p.name));
        });
        media.appendChild(img);
      }

      var info = document.createElement("div");
      info.className = "platform-card__info";

      var title = document.createElement("h3");
      title.className = "platform-card__name";
      title.textContent = p.name;

      info.appendChild(title);

      var actions = document.createElement("div");
      actions.className = "platform-card__actions";

      var play = document.createElement("a");
      play.className = "platform-card__btn platform-card__btn--secondary";
      play.href = p.playerUrl;
      play.target = "_blank";
      play.rel = "noopener noreferrer";
      play.setAttribute("aria-label", "Play — opens in a new tab");
      play.innerHTML = ICON_PLAY;

      var agent = document.createElement("a");
      agent.className = "platform-card__btn platform-card__btn--secondary";
      agent.href = p.agentUrl;
      agent.target = "_blank";
      agent.rel = "noopener noreferrer";
      agent.setAttribute("aria-label", "Agent console — opens in a new tab");
      agent.innerHTML = ICON_HEADSET;

      var buy = document.createElement("button");
      buy.type = "button";
      buy.className = "platform-card__btn platform-card__btn--primary";
      buy.setAttribute("aria-label", "Add credits to cart");
      buy.innerHTML = ICON_TELEGRAM;
      buy.addEventListener("click", function () {
        openBuyModal(p);
      });

      actions.appendChild(play);
      actions.appendChild(agent);
      actions.appendChild(buy);

      card.appendChild(media);
      card.appendChild(info);
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function heroFallback(name) {
    var el = document.createElement("div");
    el.className = "platform-card__hero-fallback";
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", name);
    el.textContent = name;
    return el;
  }

  function openBuyModal(platform) {
    selectedPlatform = platform;
    if (modalPlatform) modalPlatform.textContent = platform.name;
    if (creditAmount) {
      creditAmount.value = "";
      creditAmount.focus();
    }
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeBuyModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    selectedPlatform = null;
  }

  function openCartModal() {
    renderCartLines();
    if (cartMessage) cartMessage.value = "";
    cartModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeCartModal() {
    cartModal.hidden = true;
    document.body.style.overflow = "";
  }

  function wireModal() {
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeBuyModal);
    });
    cartModal.querySelectorAll("[data-close-cart-modal]").forEach(function (el) {
      el.addEventListener("click", closeCartModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeBuyModal();
      if (e.key === "Escape" && !cartModal.hidden) closeCartModal();
    });
  }

  function wireFloatingBubbles() {
    if (floatingTelegram) {
      floatingTelegram.addEventListener("click", function () {
        var url = "https://t.me/" + encodeURIComponent(FLOATING_TELEGRAM_USERNAME);
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    if (floatingWhatsapp) {
      function noopBubbleClick(e) {
        e.preventDefault();
      }
      floatingWhatsapp.addEventListener("click", noopBubbleClick);
    }
  }

  function readCart() {
    try {
      var raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  }

  function writeCart(items) {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }

  function buildCartLinesText(items) {
    if (!items || !items.length) return "No cart items.";
    return items
      .map(function (item, idx) {
        return (idx + 1) + ". " + (item.platform || "Platform") + " - " + String(item.credits || 0);
      })
      .join("\n");
  }

  function sendCartViaAhaSend(payload) {
    var endpoint =
      "https://api.ahasend.com/v2/accounts/" +
      encodeURIComponent(AHASEND_ACCOUNT_ID) +
      "/messages";

    return window.fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + AHASEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  }

  function getToastStack() {
    if (toastStack) return toastStack;
    toastStack = document.createElement("div");
    toastStack.className = "toast-stack";
    toastStack.setAttribute("aria-live", "polite");
    toastStack.setAttribute("aria-atomic", "true");
    document.body.appendChild(toastStack);
    return toastStack;
  }

  function showToast(message, type) {
    var stack = getToastStack();
    var toast = document.createElement("div");
    toast.className = "toast toast--" + (type || "success");
    toast.textContent = message;
    stack.appendChild(toast);
    window.setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2600);
  }

  function removeCartItemByIndex(index) {
    var cart = readCart();
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    writeCart(cart);
  }

  function updateCartButton() {
    if (!headerCartButton || !headerCartBadge || !headerCartEmpty) return;
    var count = readCart().length;
    if (count > 0) {
      headerCartBadge.textContent = String(count);
      headerCartBadge.hidden = false;
      headerCartEmpty.hidden = true;
      headerCartButton.setAttribute("aria-label", "Shopping cart with " + count + " item" + (count > 1 ? "s" : ""));
    } else {
      headerCartBadge.hidden = true;
      headerCartEmpty.hidden = false;
      headerCartButton.setAttribute("aria-label", "Shopping cart is empty");
    }
  }

  function signalCartAdded() {
    if (!headerCartButton) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    headerCartButton.classList.remove("is-blink");
    void headerCartButton.offsetWidth;
    headerCartButton.classList.add("is-blink");
    if (cartBlinkTimer) window.clearTimeout(cartBlinkTimer);
    cartBlinkTimer = window.setTimeout(function () {
      headerCartButton.classList.remove("is-blink");
      cartBlinkTimer = null;
    }, 1200);
  }

  function renderCartLines() {
    if (!cartLines) return;
    var cart = readCart();
    cartLines.innerHTML = "";
    cart.forEach(function (item, idx) {
      var row = document.createElement("li");
      row.className = "cart-lines__item";

      var name = document.createElement("span");
      name.className = "cart-lines__name";
      name.textContent = item.platform || "Platform";

      var meta = document.createElement("div");
      meta.className = "cart-lines__meta";

      var amount = document.createElement("strong");
      amount.className = "cart-lines__amount";
      amount.textContent = String(item.credits || 0);

      var removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "cart-lines__remove";
      removeBtn.setAttribute("aria-label", "Remove item from cart");
      removeBtn.textContent = "×";
      removeBtn.addEventListener("click", function () {
        removeCartItemByIndex(idx);
        renderCartLines();
        updateCartButton();
      });

      meta.appendChild(amount);
      meta.appendChild(removeBtn);
      row.appendChild(name);
      row.appendChild(meta);
      cartLines.appendChild(row);
    });
  }

  function wireCart() {
    if (headerCartButton) {
      headerCartButton.addEventListener("click", openCartModal);
    }

    if (cartContactForm) {
      cartContactForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        var cart = readCart();
        var emailInput = document.getElementById("cart-email");
        var messageInput = document.getElementById("cart-message");
        var submitBtn = cartContactForm.querySelector('button[type="submit"]');

        if (!cart.length) {
          showToast("Your cart is empty.", "error");
          return;
        }

        var userEmail = emailInput ? emailInput.value.trim() : "";
        var userMessage = messageInput ? messageInput.value.trim() : "";

        if (!userEmail) {
          showToast("Email is required.", "error");
          if (emailInput) emailInput.focus();
          return;
        }

        if (emailInput && !emailInput.checkValidity()) {
          showToast("Please enter a valid email address.", "error");
          emailInput.focus();
          return;
        }

        if (!userMessage) {
          showToast("Message is required.", "error");
          if (messageInput) messageInput.focus();
          return;
        }

        if (!AHASEND_ACCOUNT_ID || AHASEND_ACCOUNT_ID === "REPLACE_WITH_AHASEND_ACCOUNT_ID") {
          showToast("Missing AhaSend account id in js/app.js.", "error");
          return;
        }

        var textContent =
          "New cart inquiry from Velvets Vault\n\n" +
          "Customer email: " +
          (userEmail || "(not provided)") +
          "\n\n" +
          "Message:\n" +
          userMessage +
          "\n\n" +
          "Cart items:\n" +
          buildCartLinesText(cart);

        var requestPayload = {
          from: {
            email: AHASEND_FROM_EMAIL,
            name: "Velvets Vault"
          },
          recipients: [
            {
              email: AHASEND_TO_EMAIL
            }
          ],
          subject: AHASEND_SUBJECT,
          text_content: textContent,
          reply_to: userEmail
            ? {
                email: userEmail
              }
            : undefined
        };

        try {
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
          }

          var response = await sendCartViaAhaSend(requestPayload);
          if (!response.ok) {
            var errorText = "";
            try {
              errorText = await response.text();
            } catch (_) {}
            throw new Error("AhaSend error " + response.status + (errorText ? ": " + errorText : ""));
          }

          writeCart([]);
          updateCartButton();
          renderCartLines();
          cartContactForm.reset();
          closeCartModal();
          showToast("Message sent successfully.", "success");
        } catch (err) {
          showToast("Could not send message. " + (err && err.message ? err.message : ""), "error");
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Contact us";
          }
        }
      });
    }
  }

  buyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!selectedPlatform) return;
    var amount = creditAmount.value.trim();
    if (!amount) {
      creditAmount.focus();
      return;
    }

    var cart = readCart();
    cart.push({
      platform: selectedPlatform.name,
      credits: Number(amount),
      addedAt: new Date().toISOString()
    });
    writeCart(cart);
    updateCartButton();

    closeBuyModal();
    signalCartAdded();
  });

  initSplash();
  wireModal();
  wireFloatingBubbles();
  wireCart();
  updateCartButton();

  fetch("platsforms.json")
    .then(function (r) {
      if (!r.ok) throw new Error("Bad response");
      return r.json();
    })
    .then(renderPlatforms)
    .catch(function () {
      if (grid) {
        grid.innerHTML =
          '<p style="color:var(--text-muted);font-size:0.9rem;">Could not load platforms. Check that platsforms.json is available.</p>';
      }
    });
})();
