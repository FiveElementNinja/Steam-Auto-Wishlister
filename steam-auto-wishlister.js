// ==UserScript==
// @name         Steam Auto-Wishlister
// @namespace    https://github.com/FiveElementNinja/steam-auto-wishlister
// @version      0.1
// @description  Automatically adds a game to your Steam wishlist when viewing its store page if it has cards.
// @author       Five Element Ninja (@FivElementNinja)
// @match        *://store.steampowered.com/app/*
// @updateURL    https://github.com/FiveElementNinja/steam-auto-wishlister/steam-auto-wishlister.js
// @downloadURL  https://github.com/FiveElementNinja/steam-auto-wishlister/steam-auto-wishlister.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

/**
* Using plain Javascript because it's overkill to load in a second instance of jQuery just for this little script.
*/

console.log('Loaded');

(function () {
    var category_icons = document.getElementsByClassName('category_icon');
    
    if (category_icons) {
        var has_cards = false;
        var is_free = false;
        var is_dlc = false;
        
        // check if this is a free app, in which case don't add it to wishlist
        var btn_addtocart = document.getElementsByClassName('btn_addtocart');
        if (btn_addtocart) {
            for (j=0; j < btn_addtocart.length; j++) {
                if (btn_addtocart[j].firstElementChild) {
                    console.log(btn_addtocart[j].firstElementChild);
                    if (btn_addtocart[j].firstElementChild.href.match('steam://run/')) {
                        is_free = true;
                        break
                    }
                }
            }
        }
        
        // check if it has cards
        for (i=0; i < category_icons.length; i++) {
            if (category_icons[i].src.match('ico_cards')) {
                has_cards = true;
                break;
            }
            
            // check if this is a DLC app, in which case don't add it to wishlist
            if (category_icons[i].src.match('ico_dlc')) {
                is_dlc = true;
                break;
            }
        }

        // if it does have cards and isn't a F2P app or DLC, add it to the wishlist
        if (has_cards && !is_free && !is_dlc) {
            console.log('This app has cards. Adding to Wishlist.');

            var wishlist_area = document.getElementById('add_to_wishlist_area');
            if (wishlist_area && wishlist_area.firstElementChild && wishlist_area.firstElementChild.href && wishlist_area.firstElementChild.href != '' && wishlist_area.firstElementChild.href.indexOf('javascript:AddToWishlist(') === 0) {
                try {
                    // click the Add To Wishlist button
                    wishlist_area.firstElementChild.click();

                    // highlight the On Wishlist button to indicate that it has been auto-clicked
                    document.getElementsByClassName('queue_btn_active')[0].style.border ='1px solid #999999';
                } catch (err) {
                    console.log('Error adding to Wishlist. Try reloading the page.');
                }
            } else {
                console.log('This app is already on your Wishlist or there was an error.');
            }
        } else {
            console.log('This app does not have cards.');
        }
    } else {
        console.log('Script error.');
    }
}());