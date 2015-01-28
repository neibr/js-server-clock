<!DOCTYPE html>
<html>
<head>
<title>часы на JS</title>
<meta charset="utf-8">
<script type="text/javascript" src="clock.js">
</script>
</head>
<body>
<input type="hidden" id="servertime" value="<?php print time()?>"/>
<label for="location-select">Выбор города</label>
<select id="location-select">
<option value="prompt" selected>--Выберите город--</option>
<option value="litem1">Москва</option>
<option value="litem2">Киев</option>
<option value="litem3">Пекин</option>
<option value="litem4">Вашингтон</option>
<option value="litem5">Лондон</option>
<option value="litem6">Сидней</option>
<option value="litem7">Мехико</option>
</select>
<div class="time-container">
<span>Время:</span>
<span id="time"></span>
</body>
</html>
