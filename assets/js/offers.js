/* ==========================================================================
   ZYNERO — offer list
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to publish, change or remove offers.
   The Explore Offers page reads this list and builds the offer cards.
   While the list is empty, the page shows the "offers go live here" section.

   Add one object per genuine offer, for example (copy the shape, not the values):

   {
     id: "store-name",                    // unique, lowercase, no spaces
     store: "Store name",                 // shown as the card title
     category: "Fashion",                 // used for the filter buttons
     rate: "Up to 5%",                    // headline cashback, exactly as agreed with the retailer
     rateNote: "on eligible orders",      // short line under the rate
     conditions: [                        // every condition a shopper must know
       "Minimum order value ₹999",
       "Not valid on gift cards"
     ],
     trackingTime: "Within 72 hours",     // when the purchase usually shows as Tracked
     confirmationTime: "Up to 60 days",   // when the retailer usually confirms
     validUntil: "2026-12-31",            // optional, YYYY-MM-DD; expired offers hide automatically
     url: "https://..."                   // your tracking link for this retailer (must start with https://)
   }

   Only list offers with a live tracking arrangement and confirmed terms.
   ========================================================================== */

window.ZYNERO_OFFERS = [];
