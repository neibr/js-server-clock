//получить куки по имени, взято с сайта http://learn.javascript.ru/cookie
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(

    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')
            + "=([^;]*)"

    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// объект для работы с часами
LocationSwitcher = {
    /* массив вида "код города":"смещение часового пояса", предполагается что массив формируется на стороне сервера 
    в соответствии с текущей таблицей часовых поясов и обрабатывается как json-массив
	*/
    locationitems_offsets : {
        'litem1' : 3, // Москва
        'litem2' : 2, // Киев
        'litem3' : 8, // Пекин
        'litem4' : -5, // Вашингтон
        'litem5' : 0, // Лондон
        'litem6' : 11, // Сидней
        'litem7' : -6 // Мехико ...etc
    },
    time_elem_id : 'time',// id контейнера, где будет отображаться время
    location_select : 'location-select',// id контейнера-списка городов
    timestamp : 0,// метка времени, сюда будет записываться время сервера
    timestamp_elem_id : 'servertime',//id input-a с меткой времени
    date : null,//объект Date
    update_interval:1000,//период  в миллисекундах
    inc_seconds:1,//количество секунд, прибавляемых во время вызова метода обновления
    offset:0,//смещение часового пояса

    /**
     * Преобразовать объект Date в строку с временем
     * 
     * @param {object instanseof Date} - объект Date
     * @return {string} строка с временем
     */
    formatTime : function(dateobj) {
        if ((dateobj instanceof Date) == false) {
            throw new Error('Неверный объект');
        }
        var hours = dateobj.getHours();
        var minutes = "0" + dateobj.getMinutes();
        var seconds = "0" + dateobj.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(minutes.length - 2)
            + ':' + seconds.substr(seconds.length - 2);
        return formattedTime;
    },

    /**
     * Рассчитать время для часового пояса
     * 
     * @param {int} offset - смещение часового пояса относительно UTC
     * @return {object} объект Date
     */
    calcTime : function(offset) {
        if (typeof (offset) !== 'number') {
            throw new Error('Неверное смещение');
        }
        // объект Date для серверного времени
        var date = new Date(this.timestamp * 1000);
        // время для UTC в миллисекудах
        var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        // создаем новый объект Date для заданного часового пояса
        var newdate = new Date(utc + (3600000 * offset));
        
        return newdate;
    },

    /**
     * Переключить город
     * 
     * @param {string} item_id - id города или 'prompt'
     * @return {bool} true-если город преключен.
     */
    toggleLocationItem : function(item_id) {
        if ((typeof (item_id) !== 'string')) {
            throw new Error('Неверный параметр');
        }
        // если выбрано "выберите город" - ничего не делаем
        if (item_id == 'prompt') {
            return false;
        }
        //если такого города нет - ошибка
        if ((offset = this.locationitems_offsets[item_id]) == undefined) {
            throw new Error('Неверный регион');
        }
        //записываем дату в объект
        this.date = this.calcTime(offset);
        this.offset = offset;
        //отрисовка времени
        this.redraw();
        // устанавливаем код города в куки
        document.cookie = "location=" + item_id;
        return false;
    },
    
    /**
     * Перерисовка времени в соответствии с текущим состоянием Date
     * 
     * @return {bool} true
     */
    redraw: function() {
        var timestr = this.formatTime(this.date);
        // записываем время
        document.getElementById(this.time_elem_id).innerHTML = timestr;
        return true;
    },
    
    /**
     * Прибавить секунды к времени и перерисовать
     * @return {bool} true
     */
    incTime : function() {
    	//добавляем секунды
        this.date.setSeconds(this.date.getSeconds() + this.inc_seconds);
        return this.redraw();
    },

    /**
     * Инициализация объекта
     * 
     * @return {bool} true
     */
    init : function() {
        // получаем серверную метку времени из hidden
        this.timestamp = document.getElementById(this.timestamp_elem_id).value;
        locationitem = getCookie('location');
        if (locationitem === undefined) {
            // если куки нет - устанавливаем Москву
            locationitem = 'litem1';
        }
        // переключаем город
        this.toggleLocationItem(locationitem);
        // устанавливаем select option
        document.getElementById(this.location_select).value = locationitem;
        return true;
    }
}

window.onload = function() {  
    handler = function() {
        LocationSwitcher.toggleLocationItem(this.options[this.selectedIndex].value);
    }
    lselect = document.getElementById(LocationSwitcher.location_select);
    //прицепить обработчик с поддержкой <= IE8
    if (lselect.addEventListener) {
        lselect.addEventListener('change', handler, false); 
    } 
    else if (lselect.attachEvent) {
        lselect.attachEvent('onchange', handler);
    }
    //инициализируем часы после загрузки страницы
    LocationSwitcher.init();
    setInterval('LocationSwitcher.incTime()', LocationSwitcher.update_interval);
}
