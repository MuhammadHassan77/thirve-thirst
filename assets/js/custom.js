// LOGIN BUTTON HANDLIN
$(document).on("click", ".loginBtn", function (e) {
    e.preventDefault();
    let username = $("#username").val().trim();
    let password = $("#password").val().trim();
    let validation;

    if (username == "" && password == "") {
        $(".notify").html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert" style="font-size:1.2em">
        <strong>All Fields</strong> are Required.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
        </button>
    </div>`);
    }
    else if (username == "") {
        $(".notify").html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert" style="font-size:1.2em">
    <strong>Username</strong> Required.
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
        </button>
    </div>`);
    }
    else if (password == "") {
        $(".notify").html(`
    <div class="alert alert-danger alert-dismissible fade show" role="alert" style="font-size:1.2em">
        <strong>Password</strong> Required.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
        </button>
    </div>`);
    }
    else { validation = true }
    if (validation == true) {
        window.sessionStorage
        $.ajax({
            url: `https://api-thrive-thirst.000webhostapp.com/Users.php?action=login&query=${username}|${password}`,
            caches: false,
            success: (data) => {
                // console.log(data)
                if (data['result']["message"] == 'Invalid Username, Password or account is diabled!') {
                    $(".notify").html(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert" style="font-size:1.2em">
                        <strong>Invalid</strong> Username Or Password.
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                        </button>
                    </div>`);
                } else {
                    sessionStorage.setItem("username", data['result']['name']);
                    sessionStorage.setItem("storeId", data['result']['storeid']);
                    sessionStorage.setItem("userId", data['result']['userid']);
                    sessionStorage.setItem("role", data['result']['role']);
                    sessionStorage.setItem("storeName", data['result']['store']);
                    sessionStorage.setItem("location", data['result']['location']);
                    // console.log(data['result']['name'])
                    $(".notify").html(`
                        <div class="alert alert-success alert-dismissible fade show" role="alert" style="font-size:1.2em">
                            <strong>Welcome ${username}!</strong> Login Successfull.
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`);
                    $("#username").val('')
                    $("#password").val('')
                    setTimeout(() => {
                        if (data['result']['role'] == "superadmin") {
                            window.location.href = "./Super_Dashboard.html";
                        } else if (data['result']['role'] == "admin") {
                            window.location.href = "./Admin_Dashboard.html";
                        } else {
                            window.location.href = "./POS.html";
                        }
                    }, 1500);
                }
            },
            error: (err) => console.log("err ==> " + err, "\nStatusText ==> " + err.statusText)
        })
    }
})

// LOGOUT BUTTON HANDLIN
$(".logOutBtn").click(() => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("storeId");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("storeName");
    sessionStorage.removeItem("location");
    sessionStorage.clear();
    window.location.href = "./index.html";
})

// FILTER TAGS  HANDLIN
$(document).on("click", ".custom-tags", function () {
    let tag = $(this);
    $(".custom-tags").removeClass("bg-dark text-white");
    tag.addClass('bg-dark text-white');
})

// LARGE / REGULAR FILTER HANDLIN
$("#toggleLargeRegular").on("click", function () {
    ($('.custom-heading').text() == "Regular") ? $('.custom-heading').text('Large') : $('.custom-heading').text('Regular')
    $(".large").toggleClass('d-none ');
    $(".regular").toggleClass(' d-none');
})

// TOTAL AMOUNT CALCULATION 
function GetTotal() {
    var Total = 0;

    let dis_amount = parseInt($(".discountAmount").text().substr(4));

    $('#orderTable tbody tr').each(function () {
        Total += parseInt($(this).find(".subTotal").text())
    })

    if (document.getElementsByClassName("discountAmount")[0].innerText == "Rs : 0") {
        $('.totalPrice').text("Rs: " + Total);
        $('.grandTotal').text("Rs: " + Total);
    } else {
        $('.totalPrice').text("Rs: " + parseInt(Total - dis_amount));
        $('.grandTotal').text("Rs: " + parseInt(Total - dis_amount));
    }
    GetTotalItems();
}

// TOTAL ITEMS CALCULATION 
function GetTotalItems() {
    var totalItems = 0;

    $('#orderTable tbody tr').each(function () {
        totalItems += parseInt($(this).find(".pQuantity").val())
    })
    $('.totalqty').text(totalItems);
}

// REMOVE ITEM HANDLING 
$(document).on("click", ".confirm-delete", function () {
    $(this).parent().parent().parent().remove();
    $(".discountAmount").text("Rs : 0");
    GetTotal();
})

// ADDING PRODUCT TO TABLE HANDLING 
$(document).on("click", ".product", function () {

    let pId = $(this).find(".p-details");
    pId = parseInt(pId.attr('p-id'));

    let pName = $(this).find(".p-details");
    pName = pName.attr('p-name');

    let pPrice = $(this).find(".p-details");
    pPrice = parseInt(pPrice.attr('p-price'));
    // console.log(pId, pName, pPrice);


    let subTotal;

    if ($('#orderTable tbody').find("tr#" + pId).length != 0) {
        //console.log('Already Exists');
        let newqty = parseInt($("tr#" + pId).find(".pQuantity").val()) + 1;
        let newsubtotal = (newqty * pPrice);
        $("tr#" + pId).find(".pQuantity").val(newqty);
        $("tr#" + pId).find(".subTotal").text(newsubtotal + " ");
    }
    else {
        $('#orderTable tbody').append(`
                <tr id = "${pId}" >
                    <td class="PName">${pName}</td>
                    <td>
                        <input type="number" value="1" min='1' class="form-control  w-100px
                        pQuantity" p-price='${pPrice}'>
                    </td>
                    <td class="subTotal">${(subTotal == undefined) ? pPrice : subTotal}</td>
                    <td>
                        <div class="card-toolbar text-right">
                            <a role="button" class="confirm-delete" title="Delete">
                                <i class="fas fa-trash-alt"></i>
                            </a>
                        </div>
                    </td>
                </tr>`);
    }
    GetTotal();
});

// RECIEVED AMOUNT HANDLING 
$(document).on("keyup", ".recievedAmount", function () {
    let recievedAmount = $(this).val();
    let grandTotal = parseInt($(".grandTotal").text().substr(3));
    let amountToReturn = (recievedAmount - grandTotal);
    if (recievedAmount >= grandTotal) $(".placeOrderBtn").removeAttr('disabled');
    else $(".placeOrderBtn").attr('disabled', 'disabled');
    $(".amountToReturn").text("Rs : " + amountToReturn);
})

// ITEM QUANTITY HANDLING 
$(document).on("change", "input.pQuantity", function () {
    let pPrice = $(this).attr('p-price');
    let pQuantity = $(this).val();
    subTotal = pQuantity * pPrice;
    $(this).parent().parent().find('.subTotal').text(subTotal + " ");
    GetTotal();
});

// INPUT TYPE NUMBER INVALID CHARACTERS HANDLING 
$(document).on("keydown", "input[type='number']", function (e) {
    e.key === "e" && e.preventDefault();
    e.key === 'E' && e.preventDefault();
    e.key === '.' && e.preventDefault();
    e.key === '-' && e.preventDefault();
    e.key === '+' && e.preventDefault();
    e.key === ' ' && e.preventDefault();
});

// SEARCH FILTER HANDLING 
$("input.searchProduct").on("keyup", function (e) {
    let searchInput = e.target.value.trim().toLowerCase();
    $('.product').filter(function () {
        let p_name = $(this).find(".p-details").attr('p-name').toLowerCase();
        $(this).toggle(p_name.indexOf(searchInput) > -1);

        let category = $(this).find(".p-details").attr('p-category');
        category = category.replace(" ", "-");
        ($(`#${category}`).toggle($(`#${category}`).text().toLowerCase().indexOf(searchInput) > -1));
    })
})

// SCROLLING TO TOP  HANDLING 
$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll > 100) {
        $('.goToTop').removeClass('d-none');
        $('.goToTop').addClass('d-block');
    } else {
        $('.goToTop').removeClass('d-block');
        $('.goToTop').addClass('d-none');
    }

});

// HANDLING RADIO BUTTON ACTIVE
$(document).on("click", ".Active", function () {
    $(".In-Active").removeAttr("checked");
    ($(this).attr("checked", "checked"))
})

// HANDLING RADIO BUTTON IN-ACTIVE
$(document).on("click", ".In-Active", function () {
    $(".Active").removeAttr("checked");
    ($(this).attr("checked", "checked"))
})
