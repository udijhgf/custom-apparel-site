/*
  Simple client-side logic for the Custom Apparel website.

  This script handles image previews for uploaded designs, validates user
  selections, and provides feedback when users save their custom apparel
  designs. Each product section uses the same logic pattern so a helper
  function is used to avoid duplication.
*/

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Initialize a product form with preview and save behaviour.
   * @param {string} id - The id of the product section (e.g. 'tshirt').
   */
  function setupProduct(id) {
    const section = document.getElementById(id);
    const fileInput = section.querySelector('input[type="file"]');
    const previewImage = section.querySelector('.preview-image');
    const placeholder = section.querySelector('.placeholder');
    const sizeSelect = section.querySelector('select');
    const button = section.querySelector('.submit-button');
    const message = section.querySelector('.message');

    // Elements for pricing and purchases
    const priceTag = section.querySelector('.price');
    const promoInput = section.querySelector('.promo-code');
    const purchaseButton = section.querySelector('.purchase-button');
    // Base price is stored as a data attribute on the price element
    const basePrice = priceTag ? parseFloat(priceTag.dataset.price) : 0;

    // Show a preview of the uploaded image and hide the placeholder text.
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          previewImage.src = ev.target.result;
          previewImage.style.display = 'block';
          placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      } else {
        // If the user clears the file input, hide the preview and restore placeholder
        previewImage.src = '';
        previewImage.style.display = 'none';
        placeholder.style.display = 'block';
      }
    });

    // Handle saving the design: validate input and display a confirmation message.
    button.addEventListener('click', () => {
      const size = sizeSelect.value;
      if (!size) {
        alert('Please select a size before saving your design.');
        return;
      }
      if (!fileInput.files || !fileInput.files[0]) {
        alert('Please upload an image for your design.');
        return;
      }
      // Show a simple confirmation message. In a real application this is
      // where form data would be sent to a server.
      message.textContent = `Your ${id.replace('-', ' ')} design has been saved! Size: ${size}.`;
    });

    // Handle purchasing the item: validate input, compute total price and
    // navigate to a dedicated checkout page. Purchase details are saved in
    // localStorage so that checkout.html can display them and collect
    // payment information.
    if (purchaseButton) {
      purchaseButton.addEventListener('click', () => {
        const size = sizeSelect.value;
        // Validate that a size has been selected
        if (!size) {
          alert('Please select a size before purchasing your design.');
          return;
        }
        // Validate that an image has been uploaded
        if (!fileInput.files || !fileInput.files[0]) {
          alert('Please upload an image for your design.');
          return;
        }
        // Start with the base price defined in the data attribute
        let total = basePrice;
        const promo = promoInput ? promoInput.value.trim().toLowerCase() : '';
        // Apply the promo code "udidarmony" for a full discount
        if (promo === 'udidarmony') {
          total = 0;
        }
        // Human‑readable product name (replace dashes with spaces)
        const productName = id.replace(/-/g, ' ');
        // Save the purchase details to localStorage
        // Include a preview of the uploaded image so the checkout page can
        // display it. previewImage.src is a Data URL generated when the file
        // was loaded above.
        const purchaseInfo = {
          product: productName,
          size: size,
          total: total,
          imageData: previewImage ? previewImage.src : ''
        };
        try {
          localStorage.setItem('purchaseInfo', JSON.stringify(purchaseInfo));
        } catch (err) {
          console.error('Unable to store purchase information:', err);
        }
        // Redirect to the checkout page where payment details can be entered
        window.location.href = 'checkout.html';
      });
    }
  }

  // Initialize both product sections.
  setupProduct('tshirt');
  setupProduct('hoodie');
});