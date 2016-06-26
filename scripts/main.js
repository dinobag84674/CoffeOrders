$(function () {
    // define all variables here
    var $orders = $('#orders');
    var $name = $('#name');
    var $drink = $('#coffee_list'); // this variable is almost not used or needed, but I put it here just in case
    var $otherItem = $("#other");
    var orderTemplate = $('#order-template').html();
    var origin = 'http://rest.learncode.academy';

    function addOrder(order) { // creates master function for rendering the order template (using html5 template tag) using Mustache.js in index.html file
        $orders.append(Mustache.render(orderTemplate, order));
    }
    $.ajax({
        method: 'GET',
        url: origin + '/api/0b7ytdAPI/orders',
        success: function (orders) {
            console.log('success', orders);
            $.each(orders, function (i, order) {
                addOrder(order);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error loading orders');
            $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
            console.log('jqXHR:');
            console.log(jqXHR);
            console.log('textStatus:');
            console.log(textStatus);
            console.log('errorThrown:');
            console.log(errorThrown);
        }
    });
    $('#add-order').click(function () {
        $("#error_input").attr("class", "hidden");
        var order = {
            name: $name.val(),
            drink: $("#coffee_list option:selected").text(),
            other: $otherItem.val()
        };
        $.ajax({
            method: 'POST',
            url: origin + '/api/0b7ytdAPI/orders',
            data: order,
            success: function (newOrder) {
                addOrder(newOrder);
                $name.val(''); // reset the name field to an empty string (empty field)
                $("#coffee_list [value=1]").attr("selected", "selected");
                $otherItem.val(''); // reset the other item field to an empty string (empty field)
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error posting orders');
                $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
            }
        });
    });

    $orders.delegate('.remove', 'click', function () {
        var $li = $(this).closest('li');
        var self = this;
        $.ajax({
            method: 'DELETE',
            url: origin + '/api/0b7ytdAPI/orders/' + $(this).attr('data-id'),
            success: function () {
                $(self);
                $li.fadeOut(300, function () {
                    $(this).remove()
                });

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error deleting order');
                $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
            }
        });
    });
    $orders.delegate('.editOrder', 'click', function () {
        var $li = $(this).closest('li');
        $li.find('input.name').val($li.find('span.name').html());
        $li.find('select.drink').val($li.find('span.drink').html());
        $li.addClass('edit');
    });
    /*$orders.delegate('.cancelEdit', 'click', function () {
        var $li = $(this).closest('li').removeClass('edit');

    });*/
    $orders.delegate('.cancelEdit', 'click', function () {
        $(this).closest('li').removalClass('edit');
    })
    $orders.delegate('.saveEdit', 'click', function () {
        var $li = $(this).closest('li');
        var order = {
            name: $li.find('input.name').val(),
            drink: $li.find('select.drink').val(),
        };
        $.ajax({
            method: 'PUT',
            url: origin + '/api/0b7ytdAPI/orders/' + $li.attr('data-id'),
            data: order,
            success: function (newOrder) {
                $li.find('span.name').html(order.name);
                $li.find('span.drink').html(order.drink);
                $li.removeClass('edit');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert('error updating order');
                $('#result').html('<p>status code: ' + jqXHR.status + '</p><p>errorThrown: ' + errorThrown + '</p><p>jqXHR.responseText:</p><div>' + jqXHR.responseText + '</div>');
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('errorThrown:');
                console.log(errorThrown);
            }
        });
    });
});