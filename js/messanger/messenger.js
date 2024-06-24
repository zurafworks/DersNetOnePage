var groupname = $('#messengerGroupName').val();
var connection = new signalR.HubConnectionBuilder().withUrl("/liveMeetingHub").build();
function convertUtcToDate(utcDateStr) {
    // UTC zamanýyla gelen tarih
    var utcDate = new Date(utcDateStr); // Örnek bir UTC tarihi

    // Tarayýcýnýn zaman dilimini al Örn : '2024-01-06T12:34:56Z'
    var browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Tarayýcýnýn zaman dilimine göre tarihi formatla
    var localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: browserTimeZone }));
    return localDate.toLocaleString();
}

function sendMessageHub() {
    if ($('#txtMessage').val().length > 0) {
        var message = $('#txtMessage').val();
        connection.invoke("SendGroupMessage", groupname, message).catch(function (err) {
            return console.error(err.toString());
        });
        $('#txtMessage').val('');
        $('#txtMessage').focus();
    }
}

function receiveMessageHub() {
    connection.on("ReceiveGroupMessage", (name, msgDate, connectionId) => {
        var bgClassName = connectionId == connection.connectionId ? 'bg-success' : 'bg-info';
        $('#listName').append($('<li>').addClass('list-group-item ' + bgClassName).text(convertUtcToDate(msgDate) + " : " + name))
    });
}

function eventSendMessage() {
    $('#btnSenderName').click(() => {
        sendMessageHub();
    });
    $('#txtMessage').on('keyup', function (event) {
        if (event.keyCode === 13) {
            sendMessageHub();
        }
    });
}

$(document).ready(function () {
    function ShowConnectionState() {
        $('#connectionState').html(`<div class="alert alert-success">Connection Status : ${connection.q} </div>`);
    }
    connection.start().then(() => {
        ShowConnectionState();
        connection.invoke("JoinGroupChat", groupname).catch(function (err) {
            console.error(err.toString());
        });
    }).catch((err) => {
        ShowConnectionState();
        console.log('Hata : ' + err.toString());
    });

    eventSendMessage();
    receiveMessageHub();
});