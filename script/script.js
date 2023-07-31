$(function()
{
    var date = new Date();
    var city="";

    var day = date.getDate();
    var month=date.getMonth()+1;
    var year = date.getFullYear();

    if(day<10)
    day="0"+day;
    if(month<10)
    month="0"+month;

    navigator.geolocation.getCurrentPosition(updateLocation, handleError, {enableHighAccuracy: true, timeout:10000, maximumAge:30000});
    
    function setFields(msg)
    {
        var weather = msg.weather;
    
                $('#searchInput').val(msg.name)
                $("#wheather-span").text(weather[0].main);
                $("#searchInput").html(msg.name);
                $("#icon-current").attr('src',"http://openweathermap.org/img/w/"+weather[0].icon+".png");
                $("#currentDate").text(day+"."+month+"."+year);
                $('#tempCurrent').html(msg.main.temp+"&#176;C");
                $('#realFeelCurrent').html('Real Feel '+msg.main.feels_like+"&#176;C");
    
                var sunrise_time=new Date(msg.sys.sunrise * 1000);
                $('#sunrise').text('Sunrise: '+sunrise_time.getHours()+":"+sunrise_time.getMinutes());
                var sunset_time = new Date(msg.sys.sunset * 1000);
                $('#sunset').text('Sunset: '+sunset_time.getHours()+":"+sunset_time.getMinutes());
    
                var duration_time=sunset_time.getTime()-sunrise_time.getTime();
                duration_time=new Date(duration_time*1000);
                
                $('#duration').text('Duration: '+duration_time.getHours()+":"+duration_time.getMinutes());
    }

    
    function setHourlyFields(msg)
    {
        var listCounter=0;
        var hourlyWeatherDivs = $('.hourly-weather');
        hourlyWeatherDivs.each(function()
        {
            var timeWeather = msg.list[listCounter];
            var time=new Date(timeWeather.dt*1000);
            listCounter++;

            var currentDiv = $(this);
            currentDiv.find('#timeSpan').text(time.getHours()+":00");
            currentDiv.find('#img').attr('src','http://openweathermap.org/img/w/'+timeWeather.weather[0].icon+'.png');
            currentDiv.find('#weatherSpan').text(timeWeather.weather[0].main);
            currentDiv.find('#tempSpan').html(timeWeather.main.temp+'&#176;C');
            currentDiv.find('#feelSpan').html(timeWeather.main.feels_like+'&#176;C');
            currentDiv.find('#windSpan').html(timeWeather.wind.speed+'-'+timeWeather.wind.deg+'&#176;');
        });
    }

    
    function setDaysFields(msg)
    {
        var i = 0;
        var buttonsWeather = $('#fiveDaysContainer button');
        var date = "";
            
           
            buttonsWeather.each(function()
            {
                while(i<msg.list.length){
                    if(msg.list[i].dt_txt.substring(0,10)!=date)
                    {
                    date=msg.list[i].dt_txt.substring(0,10);
                    var daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                    var months = ['Jan','Feb','Mar', 'Apr','May','Jun','Jul','Aug', 'Sep', 'Oct','Nov','Dec'];
                    
                    var timeWeather = msg.list[i];
                    var time = new Date(timeWeather.dt*1000);
                    

                    var currentButton = $(this);
                    currentButton.find('#dayWeek').text(daysOfWeek[time.getDay()]);
                    currentButton.find('.day').text(months[time.getMonth()]+' '+time.getDate());
                    currentButton.find('#imgIcon').attr('src','http://openweathermap.org/img/w/'+timeWeather.weather[0].icon+'.png');
                    currentButton.find('.temp').html(timeWeather.main.temp+"&#176;C");
                    currentButton.find('.wth').text(timeWeather.weather[0].main);
                    break;
                    }
                    i++;
                }
                
            });
            
            
        
    }

    function setDaysHourlyFields(msg,date)
    {
        var hourlyWeatherDivs = $('.hourly-weather');
        for(var i=0;i< msg.list.length;i++)
        {
            if(date==msg.list[i].dt_txt.substring(8,10))
            {
                var counter = i;
                hourlyWeatherDivs.each(function()
                {
                    
                    var timeWeather = msg.list[counter];
                    var time=new Date(timeWeather.dt*1000);
                    counter++;
        
                    var currentDiv = $(this);
                    currentDiv.find('#timeSpan').text(time.getHours()+":00");
                    currentDiv.find('#img').attr('src','http://openweathermap.org/img/w/'+timeWeather.weather[0].icon+'.png');
                    currentDiv.find('#weatherSpan').text(timeWeather.weather[0].main);
                    currentDiv.find('#tempSpan').html(timeWeather.main.temp+'&#176;C');
                    currentDiv.find('#feelSpan').html(timeWeather.main.feels_like+'&#176;C');
                    currentDiv.find('#windSpan').html(timeWeather.wind.speed+'-'+timeWeather.wind.deg+'&#176;');
                });
            }
        }
        
        
    }

    function updateLocation(position){
        
        var latitude=position.coords.latitude;
        latitude = latitude.toFixed(2);
        var longitude = position.coords.longitude;
        longitude = longitude.toFixed(2);
        var linkOpenWeather="https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid=a66c8a34b2721a5055b3c5bd811fe141&units=metric";

        $.ajax({
            url:linkOpenWeather,
            type:"GET",
            datatype:"json",
            success:function(msg){
                setFields(msg);
                
            }
        });
        $.ajax({
            url : "https://api.openweathermap.org/data/2.5/forecast",
            type : "GET",
            dataType : "json",
            data : {
                lat : latitude,
                lon : longitude,
                units : "metric",
                appid : "a66c8a34b2721a5055b3c5bd811fe141"
            },
            success : function(msg)
            {
                setHourlyFields(msg);
                setDaysFields(msg);
            }
        });
    }
    function handleError(error) 
        { 
            switch(error.code) 
            { 
                case 0: 
                alert("Виникла помилка при отримання місцерозташуаання:"+ error.message); 
                break; 
                case 1: 
                alert("Користувач заборонив визначати місцезнаходження"); 
                break; 
                case 2: 
                alert("Браузеру не вдалось отримати інформації про місцезнаходження"+ error.message); 
                break; 
                case 3: 
                alert("Час очікування вийшов"); 
                break; 
 
            } 
        } 
    
    $('#searchBtn').mousedown(function(){
        $(this).css('background-color','#ccc');
    });

    $('#searchBtn').mouseup(function()
    {
        $(this).css('background-color','white');
    });

    
    $('#searchBtn').click(function()
    {
        city = $('#searchInput').val();
        var url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=a66c8a34b2721a5055b3c5bd811fe141&units=metric";

        $.ajax({
            url:url,
            type:"GET",
            datatype:"json",
            success:function(msg)
            {
                $('#currentWeather').css('visibility', 'visible');
                $('#hourlyWeather').css('visibility','visible');
                $('#errorContainer').css('visibility','hidden')
                setFields(msg);
            },
            error:function(xhr,status,error)
            {
                $('#currentWeather').css('visibility', 'hidden');
                $('#hourlyWeather').css('visibility','hidden');
                $('#fiveDaysContainer').css('visibility','hidden');
                $('#errorContainer').css('visibility','visible');
                $('#errorP').html(city+' could not be found.<br>Please enter a different location.');
            }
        });

        $.ajax({
            url : "https://api.openweathermap.org/data/2.5/forecast",
            type : "GET",
            dataType : "json",
            data : {
                q: city,
                units : "metric",
                appid : "a66c8a34b2721a5055b3c5bd811fe141"
            },
            success : function(msg)
            {
                setHourlyFields(msg);
                setDaysFields(msg);
            },
            error:function(xhr,status,error)
            {
                $('#currentWeather').css('visibility', 'hidden');
                $('#hourlyWeather').css('visibility','hidden');
                $('#fiveDaysContainer').css('visibility','hidden');
                $('#errorContainer').css('visibility','visible');
                $('#errorP').html(city+' could not be found.<br>Please enter a different location.');
            }
        });
    });

    var buttons = $('#fiveDaysContainer button').click(function()
    {
        city = $('#searchInput').val();
        buttons.removeClass('selected');
        currentButton = $(this);
        $(currentButton).addClass('selected');
        $.ajax({
            url : "https://api.openweathermap.org/data/2.5/forecast",
            type : "GET",
            dataType : "json",
            data : {
                q: city,
                units : "metric",
                appid : "a66c8a34b2721a5055b3c5bd811fe141"
            },
            success : function(msg)
            {
                setDaysHourlyFields(msg,$(currentButton).find('.day').text().substring(4,6));
            }
        
    });
    });

    $('#todayBtn').mouseover(function()
    {
        $('#todayBtn').css('border-bottom','2px solid darkblue');
    });

    $('#todayBtn').mouseout(function()
    {
        $('#todayBtn').css('border-bottom','0px solid darkblue');
    });

    $('#todayBtn').click(function()
    {
        $('#currentWeather').css('visibility', 'visible');
        $('#hourlyWeather').css('margin-top','25px');
        $('#daysBtn').css('border-left','0px solid darkgray');
        $('#daysBtn').css('border-right','0px solid darkgray');
        $('#daysBtn').css('border-bottom','0px solid darkblue');
        $('#todayBtn').css('border-left','1px solid darkgray');
        $('#todayBtn').css('border-right','1px solid darkgray');
        $('#todayBtn').css('border-bottom','2px solid darkblue');
        $('#fiveDaysContainer').css('visibility','hidden');
    });

    $('#daysBtn').mouseover(function()
    {
        $('#daysBtn').css('border-bottom','2px solid darkblue');
    });

    $('#daysBtn').mouseout(function()
    {
        $('#daysBtn').css('border-bottom','0px solid darkblue');
    });

    $('#daysBtn').click(function(){

        $('#fiveDaysContainer').css('visibility','visible');
        $('#currentWeather').css('visibility', 'hidden');
        $('#hourlyWeather').css('margin-top','8px');
        $('#daysBtn').css('border-left','1px solid darkgray');
        $('#daysBtn').css('border-right','1px solid darkgray');
        $('#daysBtn').css('border-bottom','2px solid darkblue');
        $('#todayBtn').css('border-left','0px solid darkgray');
        $('#todayBtn').css('border-right','0px solid darkgray');
        $('#todayBtn').css('border-bottom','0px solid darkgray');
        $('#fiveDaysContainer button').removeClass('selected');
        $('#fiveDaysContainer>button:first-child').addClass('selected');
    });

    $('.five-days-container>button').mouseover(function()
    {
        $(this).css('background-color','silver');
    });
    $('.five-days-container>button').mouseout(function()
    {
        $(this).css('background-color','white');
    });
    
    
});
