let brandedFoodItems = [], selfFoodItems=[], commonFoodItems=[], searchQuery='',listLength,common, waterAmount = 0, commonLength, brandedLength, tempRow, commonNutrition, brandedNutrition;
let commonData=[], brandedData=[], commonBody = $('#common-body'), brandedBody = $('#branded-body'), selectedBody = $('#selected-body'), selectedBodyRows, nameElements = [], capName = '', selectedArray=[], mealBodySelector=0;
const breakfastBody = $('#breakfast-body'), lunchBody = $('#lunch-body'), dinnerBody = $('#dinner-body'), snacksBody = $('#snacks-body'); waterBody = $('#water-body');
// let breakfastRows = $('#breakfast-body tr'), lunchRows = $('#lunch-body tr'), dinnerRows = $('dinner-body tr'), snacksRows = $('#snacks-body tr');
let breakfastCalories = $('#breakfast-calories'), lunchCalories = $('#lunch-calories'), dinnerCalories = $('#dinner-calories'), snacksCalories = $('#snacks-calories');
let bCalories = 0, lCalories = 0, dCalories = 0, sCalories = 0, goalCalories = 2000, proportion = 0, currentWidth=0, parentWidth, dailyNutrients, replaceIndex=0, countDaily = 0;
let dailyFoods=[], breakfastFoods =[], lunchFoods=[],dinnerFoods=[],snacksFoods=[];
let easeEdit;

function totalCals(){
    totalCalories = bCalories + lCalories + dCalories + sCalories;
    proportion = totalCalories / goalCalories * 100;
    // currentWidth =($('#calorie-bar').css('width'))/($('#calorie-bar').parent().css('width'))*100;
    currentWidth = $('#calorie-bar').css('width');
    currentWidth = parseFloat(currentWidth.substring(0,currentWidth.length-1));
    parentWidth = $('#calorie-bar').parent().css('width');
    parentWidth = parseFloat(parentWidth.substring(0,parentWidth.length-1));
    let easeCalories = anime({
        targets: '#calorie-bar',
        width: [`${currentWidth/parentWidth*100}%`, `${proportion}%`],
        duration: 1000,
        loop: false,
        autoplay: false,
        easing: 'easeOutSine'
    });
    if(proportion>=85){
        $('#calorie-bar').css({'background' : 'red'});
    } else if (proportion >=50){
        $('#calorie-bar').css({'background' : 'orange'});
    } else{
        $('#calorie-bar').css({'background' : 'green'});
    }
    if(proportion>100){
        proportion = 100;
        // easeCalories.restart();
        $('#calorie-bar').css({'width' : '100%'});
        $('#calorie-proportion').text('Goal of ' + goalCalories + ' calories exceeded by ' + (totalCalories-goalCalories).toFixed(2));
        // easeCalories.restart();
    } else{
        $('#calorie-bar').css({'width' : `${proportion}%`});
        // easeCalories.restart();
        $('#calorie-proportion').text(totalCalories.toFixed(2) + ' out of ' + goalCalories + ' calories consumed');
        // easeCalories.restart();
    }
    easeCalories.play();
}
$(function(){
    totalCals();
    dailyNutrients = {
        calories: 0,
        cholesterol: 0,
        dietary_fiber: 0,
        potassium: 0,
        protein: 0,
        saturated_fat: 0,
        sodium: 0,
        sugar: 0,
        carbohydrates: 0,
        total_fat: 0
    }
    let easeOpen = anime({
        targets:'.modal',
        opacity:1,
        duration:250,
        loop:false,
        autoplay:false,
        easing:'linear'
    });
    let easeClose = anime({
        targets:'.modal',
        opacity:0,
        duration:250,
        loop:false,
        autopaly:false,
        easing:'linear'
    });
    let easeContent = anime({
        targets:'.modal-content',
        top:'20%',
        duration:250,
        loop:false,
        autoplay:false,
        easing:'easeOutSine'
    });
    function closeModal(e){
        easeClose.restart();
        $('body').removeClass('body-fixed');
        $(this).closest('.modal').addClass('hidden');
        $('#search').val('');
        querySearch();
        selectedBody.empty();
        $('#selected-container').css({'display' : 'none'});
        selectedArray=[];
    };
    $('.modal-bg').on('click',closeModal);
    $('.modal-form').on('submit',function(e){
        $('.modal-form input[type="text"]').val('');
        $('.modal-form input[type="number"]').val('');
    });
    $('.modal-form').on('submit',closeModal);
    $('.add-btn').on('click', function(e){
        brandedFoodItems = [];
        selfFoodItems = [];
        commonFoodItems = [];
        $('#item-modal').removeClass('hidden');
        $('body').addClass('body-fixed');
        easeOpen.restart();
        easeContent.restart();
    });

    $('.water-btn').on('click', function(e){
        $('#water-modal').removeClass('hidden');
        $('body').addClass('body-fixed');
        easeOpen.restart();
        easeContent.restart();
    });
    $('#water-submit-btn').on('click', closeModal);
    $('#water-submit-btn').on('click', function(e){
        $('#water-input input[type="number"]').val('0');
    });
    $('.quick-add-btn').on('keyup',function(e){
        $('#water-input input[type="number"]').val('0');
    });
    $('.quick-add-btn').on('click', closeModal);
    $('#submit-selected').on('click',closeModal);
});

// $.post(
//     'https://trackapi.nutritionix.com/v2/auth/signin',
//     {
//         password: '',
//         email: '',
//     },
//     function(data){
//         userValues = Object.values(data);
//         userToken = userValues[1];
//     }
// );

// Need to change all arguments in abb-btn function to code data to prevent security issues.
$('.add-btn').on('click', function(e){
    if($(this).closest('.food-table').parent().children('#breakfast-table').length==1){
        mealBodySelector=1;
        $('#meal-select button').css({'box-shadow':'0px 5px 0px black', 'top':'0px'});
        $('#meal-select #breakfast-select').css({'box-shadow':'0px 3px 0px black', 'top':'3px'});
    } else if($(this).closest('.food-table').parent().children('#lunch-table').length==1){
        mealBodySelector=2;
    $('#meal-select button').css({'box-shadow':'0px 5px 0px black', 'top':'0px'});
    $('#meal-select #lunch-select').css({'box-shadow':'0px 3px 0px black', 'top':'3px'});
    } else if($(this).closest('.food-table').parent().children('#dinner-table').length==1){
        mealBodySelector=3;
        $('#meal-select button').css({'box-shadow':'0px 5px 0px black', 'top':'0px'});
        $('#meal-select #dinner-select').css({'box-shadow':'0px 3px 0px black', 'top':'3px'});
    } else if($(this).closest('.food-table').parent().children('#snacks-table').length==1){
        mealBodySelector=4;
        $('#meal-select button').css({'box-shadow':'0px 5px 0px black', 'top':'0px'});
        $('#meal-select #snacks-select').css({'box-shadow':'0px 3px 0px black', 'top':'3px'});
    }
});
$('#breakfast-select').on('click',function(e){
    console.log('breakfast clicked');
    mealBodySelector=1;
});
$('#lunch-select').on('click',function(e){
    // console.log('lunch clicked');
    mealBodySelector=2;
});
$('#dinner-select').on('click',function(e){
//     console.log('dinner clicked');
    mealBodySelector=3;
});
$('#snacks-select').on('click',function(e){
    // console.log('snacks clicked');
    mealBodySelector=4;
});
$('.meal-select').on('click',function(e){
    $('.meal-select').css({'box-shadow':'0px 5px 0px black', 'top':'0px'});
    $(this).css({'box-shadow':'0px 3px 0px black', 'top':'3px'});
});
function generateCommonSearchItem(commonFood){
    return ` <tr class='searched-common-row'>
    <td class="searched-photo"><img src=${commonFood.photo} /></td>
    <td class="searched-name">${commonFood.name}</td>
    </tr>
    `;
};
function generateBrandedSearchItem(brandedFood){
    return ` <tr class='searched-branded-row'>
    <td class="searched-photo"><img src="${brandedFood.photo}"/></td>
    <td class="searched-name">${brandedFood.name}</td>
    </tr>
    `;
}
function generateSelectedItem(selected){
    return `<tr class="selected-item-row">
    <td class="searched-photo"><img src=${selected.photo} /></td>
    <td class="searched-name">${selected.name}</td>
    <td #quantity-form><form>
        <input type="number" name="serving-quantity" id="serving-quantity" value="1" steps="1" min="1" required/>
    </form></td>
    </tr>
    `;
}
function capitalizeWords(name){
    nameElements = [];
    capName = '';
    if(name.indexOf(' ') == -1){
        return name.charAt(0).toUpperCase() + name.substring(1,name.length);
    } else{
        nameElements = name.split(' ');
        capName = nameElements[0].charAt(0).toUpperCase() + nameElements[0].substring(1,nameElements[0].length);
        for(let i = 1; i<nameElements.length;i++){
            let tempString = nameElements[i];
            nameElements[i] = tempString.charAt(0).toUpperCase() + tempString.substring(1,tempString.length);
            capName = capName + ' ' + nameElements[i];
        }
        return capName;
    }
}
function addNutrients(food){
    dailyNutrients.calories += food.nf_calories*food.quantity;
    dailyNutrients.cholesterol += food.nf_cholesterol*food.quantity;
    dailyNutrients.dietary_fiber += food.nf_dietary_fiber*food.quantity;
    dailyNutrients.potassium += food.nf_potassium*food.quantity;
    dailyNutrients.protein += food.nf_protein*food.quantity;
    dailyNutrients.saturated_fat += food.nf_saturated_fat*food.quantity;
    dailyNutrients.sodium += food.nf_sodium*food.quantity;
    dailyNutrients.sugar += food.nf_sugars*food.quantity;
    dailyNutrients.carbohydrates += food.nf_total_carbohydrate*food.quantity;
    dailyNutrients.total_fat += food.nf_total_fat*food.quantity;
}
function generateBodyRow(selectedFood){
    let name = capitalizeWords(selectedFood.food_name);
    return `<tr class="meal-food-row">
    <td class="searched-name row-hover"><span class="food-name row-hover">${name}</span><br><span class='serving-description row-hover'>${selectedFood.serving_qty*selectedFood.quantity} ${selectedFood.serving_unit}<span></td>
    <td class="searched-calories row-hover">${selectedFood.nf_calories*selectedFood.quantity}</td>
    </tr>
    `
}
function querySearch(e){
    searchQuery = $('#search').val();
    // console.log(searchQuery);
    if(searchQuery.length<=0){
        $('#common-table').css({'display' : 'none'});     
        $('#branded-table').css({'display' : 'none'});     
    } else if(searchQuery.length>0){
        $.ajax({
            url: 'https://trackapi.nutritionix.com/v2/search/instant',
            type: 'post',
            headers: {
                // 'x-user-jwt': userToken,
                'x-app-id': '6ea566a9',
                'x-app-key': '1f90bee36f60833ee304760071f5e7fd'
            },
            data: {
                'query': searchQuery
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                commonBody.empty();
                brandedBody.empty();
                brandedFoodItems = [];
                selfFoodItems = [];
                commonFoodItems = [];
                let branded=data.branded;
                // let self=data.self;
                let common=data.common;
                branded.forEach(function(item,index){
                    let tempItem = branded[index];
                    brandedFoodItems.push(tempItem);
                });
                common.forEach(function(item,index){
                    let tempItem = common[index];
                    commonFoodItems.push(tempItem);
                });
                commonLength = (commonFoodItems.length>=4) ? 4 : commonFoodItems.length;
                brandedLength = (brandedFoodItems.length>=4) ? 4 : brandedFoodItems.length;
                if(commonFoodItems.length>0){
                    $('#common-table').css({'display' : 'block'});
                    commonData=[];
                    for(let i = 0; i < commonLength; i++){
                        let tempCommon = commonFoodItems[i];
                        let capSearchName = capitalizeWords(tempCommon.food_name);
                        let tempPhoto = (tempCommon.photo.thumb==null) ? "https://www.freeiconspng.com/uploads/no-image-icon-6.png" : tempCommon.photo.thumb;
                        commonFood = {
                            name : capSearchName,
                            photo : tempPhoto,
                            // servingAmount : tempCommon.serving_qty,
                            // servingUnit : tempCommon.serving_unit,
                            id: tempCommon.tag_id
                        }
                        let newCommonRow = generateCommonSearchItem(commonFood);
                        commonBody.append(newCommonRow);
                        commonData.push(commonFood);
                    }
                } else if(commonFoodItems.length==0){
                    $('#common-table').css({'display' : 'none'});  
                }
                if(brandedFoodItems.length>0){
                    $('#branded-table').css({'display' : 'block'});
                    brandedData=[];
                    for(let i = 0; i<brandedLength; i++){
                        let tempBranded = brandedFoodItems[i];
                        let capSearchName = capitalizeWords(tempBranded.food_name);
                        let tempPhoto = (tempBranded.photo.thumb==null || tempBranded.photo.thumb=="https://d2eawub7utcl6.cloudfront.net/images/nix-apple-grey.png") ? "https://www.freeiconspng.com/uploads/no-image-icon-6.png" : tempBranded.photo.thumb;
                        brandedFood = {
                            name : capSearchName,
                            photo : tempPhoto,
                            servingAmount : tempBranded.serving_qty,
                            servingUnit : tempBranded.serving_unit,
                            id : tempBranded.nix_item_id
                        }
                        let newBrandedRow = generateBrandedSearchItem(brandedFood);
                        brandedBody.append(newBrandedRow);
                        brandedData.push(brandedFood);
                    }
                } else if(brandedFoodItems.length==0){
                    $('#branded-table').css({'display' : 'none'});
                }
                searchQuery='';
                $('.searched-common-row').on('click',function(e){
                    $('#selected-container').css({'display' : 'block'});
                    tempRow =  $(e.target).parent();
                    tempRow.removeClass('searched-common-row');
                    /* Need to change the temp code so that data is accessed from the code instead of the html itself.
                    Security risks and easily editable by users if they pull up console. */
                    temp = {
                        photo : tempRow.find('td.searched-photo').find("img")[0].src,
                        name: tempRow.find('td.searched-name')[0].innerHTML,
                        id : commonData.find(x => x.name = tempRow.find('td.searched-name')[0].innerHTML).id
                    }
                    $.ajax({
                        url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
                        type: 'POST',
                        contentType: 'application/json',
                        headers : {
                            "x-app-id" : "6ea566a9",
                            "x-app-key" : "1f90bee36f60833ee304760071f5e7fd",
                            "x-remote-user-id" : "0"
                        },
                        data: JSON.stringify({
                            query : temp.name,
                        }),
                        success: function(data){
                            commonNutrition = data.foods[0];
                            commonNutrition.databaseType = 'common';
                            selectedArray.push(commonNutrition);
                            // console.log('selected Array after common add')
                            console.log(selectedArray);
                        },
                        error: function(){
                            alert("invalid");
                        }
                    });
                    selectedRow = generateSelectedItem(temp);
                    selectedBody.append(selectedRow);
                    // console.log('selected Array outside common add')
                    // console.log(selectedArray);
                    $('#common-table').css({'display' : 'none'});     
                    $('#branded-table').css({'display' : 'none'});    
                    $('#search').val('');
                });
                $('.searched-branded-row').on('click',function(e){
                    $('#selected-container').css({'display' : 'block'});
                    tempRow =  $(e.target).parent();
                    tempRow.removeClass('searched-branded-row');
                    /* Need to change the temp code so that data is accessed from the back-end instead of the html itself.
                    Security risks and easily editable by users if they pull up console. */
                    temp = {
                        photo : tempRow.find('td.searched-photo').find("img")[0].src,
                        name: tempRow.find('td.searched-name')[0].innerHTML,
                        id : brandedData.find(x => x.name = tempRow.find('td.searched-name')[0].innerHTML).id
                    }
                    $.ajax({
                        url: 'https://trackapi.nutritionix.com/v2/search/item',
                        type: 'GET',
                        headers: {
                            'x-app-id': '6ea566a9',
                            'x-app-key': '1f90bee36f60833ee304760071f5e7fd'
                        },
                        data: {
                            'nix_item_id' :temp.id,
                        },
                        dataType: 'json',
                        success: function(data){
                           brandedNutrition = data.foods[0];
                           brandedNutrition.databaseType = 'branded';
                           selectedArray.push(brandedNutrition);
                           console.log('selected Array after branded add')
                           console.log(selectedArray)
                        }
                    });
                    selectedRow = generateSelectedItem(temp);
                    selectedBody.append(selectedRow);
                    commonBody.empty();
                    brandedBody.empty();
                    brandedFoodItems = [];
                    selfFoodItems = [];
                    commonFoodItems = [];
                    $('#common-table').css({'display' : 'none'});     
                    $('#branded-table').css({'display' : 'none'});    
                    $('#search').val('');
                });
            }
        });
    }
};
$('#search').on('keyup', _.debounce(querySearch, 250, {'leading': true, 'trailing': true, 'maxWait': 750}));
$('#submit-selected').on('click',function(e){
    // console.log(selectedArray);
    selectedBodyRows = selectedBody.find('tr');
    for(let i = 0; i < selectedBodyRows.length; i++){
        let temp = selectedBodyRows[i];
        selectedArray[i].quantity = parseInt($(temp).find('#serving-quantity')[0].value);
    }
    if(mealBodySelector==1){
        selectedArray.forEach(function(e){
            let count = 0;
            if((e.databaseType == 'branded') && (dailyFoods.length > 0)){
                console.log('entered branded search');
                for(let i = 0; i < breakfastFoods.length; i++){
                    if(breakfastFoods[i].nix_item_id == e.nix_item_id){
                        count++;
                    } 
                    console.log(count);
                }
            } else if((e.databaseType == 'common') && dailyFoods.length > 0){
                console.log('entered common search');
                for(let i = 0; i < breakfastFoods.length; i++){
                    if(breakfastFoods[i].databaseType == 'common'){
                        if(breakfastFoods[i].tags.tag_id == e.tags.tag_id){
                            count++;
                        }
                    }
                }
                console.log(count);
            } 
            console.log(count);
            bCalories = bCalories + parseFloat(e.nf_calories*e.quantity);
            tempRow = generateBodyRow(e);
            if(count >= 1){
                if(e.databaseType == 'branded'){
                    console.log('enteredBranded');
                    let tempBranded = breakfastFoods.find(x => x.nix_item_id === e.nix_item_id)
                    tempBranded.quantity += e.quantity;
                    dailyFoods.find(x => x.nix_item_id === e.nix_item_id).quantity += e.quantity;
                    replaceIndex = tempBranded.arrayIndex;
                    tempRow= generateBodyRow(tempBranded);
                    $('#breakfast-body tr').eq(replaceIndex).before(tempRow);
                    $('#breakfast-body tr').eq(replaceIndex+1).remove();
                } else if(e.databaseType == 'common'){
                    console.log('enteredCommon');
                    let tempCommon;
                    for(let i = 0; i<breakfastFoods.length;i++){
                        console.log('breakfast loop index' + i)
                        if(breakfastFoods[i].databaseType == 'common'){
                            if(breakfastFoods[i].tags.tag_id == e.tags.tag_id){
                                tempCommon = breakfastFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                replaceIndex = tempCommon.arrayIndex;
                                console.log('temp quanity before',breakfastFoods[replaceIndex].quantity);
                                console.log('daily quantity before', dailyFoods[replaceIndex].quantity);
                                breakfastFoods[replaceIndex].quantity += e.quantity;
                                console.log('selected array quantity',e.quantity);
                                console.log('temp quantity after', breakfastFoods[replaceIndex].quantity);
                                console.log('daily quantity after', dailyFoods[replaceIndex].quantity);
                                tempRow= generateBodyRow(tempCommon);
                                $('#breakfast-body tr').eq(replaceIndex).before(tempRow);
                                $('#breakfast-body tr').eq(replaceIndex+1).remove();
                                break;
                            }
                        }
                    }
                    console.log('temp quantity afterfor', breakfastFoods[replaceIndex].quantity);
                    console.log('daily quantity afterfor', dailyFoods[replaceIndex].quantity);
                }
            } else{
                countDaily = 0;
                for(let i = 0; i<dailyFoods.length; i++){
                    if(dailyFoods[i].databaseType == 'common'){
                        if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                            countDaily++;
                            break;
                        }
                    } else if(dailyFoods[i].databaseType == 'branded'){
                        if(dailyFoods[i].nix_item_id == e.nix_item_id){
                            countDaily++;
                            break;
                        }
                    }
                }
                if(countDaily > 0){
                    if(e.databaseType == 'branded' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].nix_item_id == e.nix_item_id){
                                    tempDaily = dailyFoods.find(x => x.nix_item_id === e.nix_item_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } else if(e.databaseType == 'common' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                                    tempDaily = dailyFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } 
                }   
                else{
                    dailyFoods.push(e);
                    console.log('here',e)
                    dateDoc
                    dailyFoods[dailyFoods.length-1].arrayIndex = dailyFoods.length-1;
                }
                breakfastFoods.push(e);
                breakfastFoods[breakfastFoods.length-1].arrayIndex = breakfastFoods.length-1;
                breakfastBody.append(tempRow);
            }
            console.log('temp quantity after everything', breakfastFoods[replaceIndex].quantity);
            console.log('daily quantity after everything', dailyFoods[replaceIndex].quantity);
            console.log('selected array', selectedArray);
            console.log('breakfast foods',breakfastFoods);
            console.log('daily foods', dailyFoods);
        });
        breakfastCalories.text(bCalories.toFixed(2));
        totalCals();
    } else if(mealBodySelector==2){
        selectedArray.forEach(function(e){
            let count = 0;
            if((e.databaseType == 'branded') && (dailyFoods.length > 0)){
                console.log('entered branded search');
                for(let i = 0; i < lunchFoods.length; i++){
                    if(lunchFoods[i].nix_item_id == e.nix_item_id){
                        count++;
                    } 
                    console.log(count);
                }
            } else if((e.databaseType == 'common') && dailyFoods.length > 0){
                console.log('entered common search');
                for(let i = 0; i < lunchFoods.length; i++){
                    if(lunchFoods[i].databaseType == 'common'){
                        if(lunchFoods[i].tags.tag_id == e.tags.tag_id){
                            count++;
                        }
                    }
                }
                console.log(count);
            } 
            console.log(count);
            lCalories = lCalories + parseFloat(e.nf_calories*e.quantity);
            tempRow = generateBodyRow(e);
            if(count >= 1){
                if(e.databaseType == 'branded'){
                    console.log('enteredBranded');
                    let tempBranded = lunchFoods.find(x => x.nix_item_id === e.nix_item_id)
                    tempBranded.quantity += e.quantity;
                    dailyFoods.find(x => x.nix_item_id === e.nix_item_id).quantity += e.quantity;
                    replaceIndex = tempBranded.arrayIndex;
                    tempRow= generateBodyRow(tempBranded);
                    $('#lunch-body tr').eq(replaceIndex).before(tempRow);
                    $('#lunch-body tr').eq(replaceIndex+1).remove();
                } else if(e.databaseType == 'common'){
                    console.log('enteredCommon');
                    let tempCommon;
                    for(let i = 0; i<lunchFoods.length;i++){
                        console.log('lunch loop index' + i)
                        if(lunchFoods[i].databaseType == 'common'){
                            if(lunchFoods[i].tags.tag_id == e.tags.tag_id){
                                tempCommon = lunchFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                replaceIndex = tempCommon.arrayIndex;
                                console.log('temp quanity before',lunchFoods[replaceIndex].quantity);
                                console.log('daily quantity before', dailyFoods[replaceIndex].quantity);
                                lunchFoods[replaceIndex].quantity += e.quantity;
                                console.log('selected array quantity',e.quantity);
                                console.log('temp quantity after', lunchFoods[replaceIndex].quantity);
                                console.log('daily quantity after', dailyFoods[replaceIndex].quantity);
                                tempRow= generateBodyRow(tempCommon);
                                $('#lunch-body tr').eq(replaceIndex).before(tempRow);
                                $('#lunch-body tr').eq(replaceIndex+1).remove();
                                break;
                            }
                        }
                    }
                    console.log('temp quantity afterfor', lunchFoods[replaceIndex].quantity);
                    console.log('daily quantity afterfor', dailyFoods[replaceIndex].quantity);
                }
            } else{
                countDaily = 0;
                for(let i = 0; i<dailyFoods.length; i++){
                    if(dailyFoods[i].databaseType == 'common'){
                        if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                            countDaily++;
                            break;
                        }
                    } else if(dailyFoods[i].databaseType == 'branded'){
                        if(dailyFoods[i].nix_item_id == e.nix_item_id){
                            countDaily++;
                            break;
                        }
                    }
                }
                if(countDaily > 0){
                    if(e.databaseType == 'branded' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].nix_item_id == e.nix_item_id){
                                    tempDaily = dailyFoods.find(x => x.nix_item_id === e.nix_item_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } else if(e.databaseType == 'common' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                                    tempDaily = dailyFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } 
                }
                else{
                    dailyFoods.push(e);
                    dailyFoods[dailyFoods.length-1].arrayIndex = dailyFoods.length-1;
                }
                lunchFoods.push(e);
                lunchFoods[lunchFoods.length-1].arrayIndex = lunchFoods.length-1;
                lunchBody.append(tempRow);
            }
            console.log('temp quantity after everything', lunchFoods[replaceIndex].quantity);
            console.log('daily quantity after everything', dailyFoods[replaceIndex].quantity);
            console.log('selected array', selectedArray);
            console.log('lunch foods',lunchFoods);
            console.log('daily foods', dailyFoods);
        }); 
       lunchCalories.text(lCalories.toFixed(2));
       totalCals();
    } else if(mealBodySelector==3){
        selectedArray.forEach(function(e){
            let count = 0;
            if((e.databaseType == 'branded') && (dailyFoods.length > 0)){
                console.log('entered branded search');
                for(let i = 0; i < dinnerFoods.length; i++){
                    if(dinnerFoods[i].nix_item_id == e.nix_item_id){
                        count++;
                    } 
                    console.log(count);
                }
            } else if((e.databaseType == 'common') && dailyFoods.length > 0){
                console.log('entered common search');
                for(let i = 0; i < dinnerFoods.length; i++){
                    if(dinnerFoods[i].databaseType == 'common'){
                        if(dinnerFoods[i].tags.tag_id == e.tags.tag_id){
                            count++;
                        }
                    }
                }
                console.log(count);
            } 
            console.log(count);
            dCalories = dCalories + parseFloat(e.nf_calories*e.quantity);
            tempRow = generateBodyRow(e);
            if(count >= 1){
                if(e.databaseType == 'branded'){
                    console.log('enteredBranded');
                    let tempBranded = dinnerFoods.find(x => x.nix_item_id === e.nix_item_id)
                    tempBranded.quantity += e.quantity;
                    dailyFoods.find(x => x.nix_item_id === e.nix_item_id).quantity += e.quantity;
                    replaceIndex = tempBranded.arrayIndex;
                    tempRow= generateBodyRow(tempBranded);
                    $('#dinner-body tr').eq(replaceIndex).before(tempRow);
                    $('#dinner-body tr').eq(replaceIndex+1).remove();
                } else if(e.databaseType == 'common'){
                    console.log('enteredCommon');
                    let tempCommon;
                    for(let i = 0; i<dinnerFoods.length;i++){
                        console.log('dinner loop index' + i)
                        if(dinnerFoods[i].databaseType == 'common'){
                            if(dinnerFoods[i].tags.tag_id == e.tags.tag_id){
                                tempCommon = dinnerFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                replaceIndex = tempCommon.arrayIndex;
                                console.log('temp quanity before',dinnerFoods[replaceIndex].quantity);
                                console.log('daily quantity before', dailyFoods[replaceIndex].quantity);
                                dinnerFoods[replaceIndex].quantity += e.quantity;
                                console.log('selected array quantity',e.quantity);
                                console.log('temp quantity after', dinnerFoods[replaceIndex].quantity);
                                console.log('daily quantity after', dailyFoods[replaceIndex].quantity);
                                tempRow= generateBodyRow(tempCommon);
                                $('#dinner-body tr').eq(replaceIndex).before(tempRow);
                                $('#dinner-body tr').eq(replaceIndex+1).remove();
                                break;
                            }
                        }
                    }
                    console.log('temp quantity afterfor', dinnerFoods[replaceIndex].quantity);
                    console.log('daily quantity afterfor', dailyFoods[replaceIndex].quantity);
                }
            } else{
                countDaily = 0;
                for(let i = 0; i<dailyFoods.length; i++){
                    if(dailyFoods[i].databaseType == 'common'){
                        if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                            countDaily++;
                            break;
                        }
                    } else if(dailyFoods[i].databaseType == 'branded'){
                        if(dailyFoods[i].nix_item_id == e.nix_item_id){
                            countDaily++;
                            break;
                        }
                    }
                }
                if(countDaily > 0){
                    if(e.databaseType == 'branded' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].nix_item_id == e.nix_item_id){
                                    tempDaily = dailyFoods.find(x => x.nix_item_id === e.nix_item_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } else if(e.databaseType == 'common' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                                    tempDaily = dailyFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } 
                }
                else{
                    dailyFoods.push(e);
                    dailyFoods[dailyFoods.length-1].arrayIndex = dailyFoods.length-1;
                }
                dinnerFoods.push(e);
                dinnerFoods[dinnerFoods.length-1].arrayIndex = dinnerFoods.length-1;
                dinnerBody.append(tempRow);
            }
            console.log('temp quantity after everything', dinnerFoods[replaceIndex].quantity);
            console.log('daily quantity after everything', dailyFoods[replaceIndex].quantity);
            console.log('selected array', selectedArray);
            console.log('dinner foods',dinnerFoods);
            console.log('daily foods', dailyFoods);
        }); 
        dinnerCalories.text(dCalories.toFixed(2));
        totalCals();
    } else if(mealBodySelector==4){
        selectedArray.forEach(function(e){
            let count = 0;
            if((e.databaseType == 'branded') && (dailyFoods.length > 0)){
                console.log('entered branded search');
                for(let i = 0; i < snacksFoods.length; i++){
                    if(snacksFoods[i].nix_item_id == e.nix_item_id){
                        count++;
                    } 
                    console.log(count);
                }
            } else if((e.databaseType == 'common') && dailyFoods.length > 0){
                console.log('entered common search');
                for(let i = 0; i < snacksFoods.length; i++){
                    if(snacksFoods[i].databaseType == 'common'){
                        if(snacksFoods[i].tags.tag_id == e.tags.tag_id){
                            count++;
                        }
                    }
                }
                console.log(count);
            } 
            console.log(count);
            dCalories = dCalories + parseFloat(e.nf_calories*e.quantity);
            tempRow = generateBodyRow(e);
            if(count >= 1){
                if(e.databaseType == 'branded'){
                    console.log('enteredBranded');
                    let tempBranded = snacksFoods.find(x => x.nix_item_id === e.nix_item_id)
                    tempBranded.quantity += e.quantity;
                    dailyFoods.find(x => x.nix_item_id === e.nix_item_id).quantity += e.quantity;
                    replaceIndex = tempBranded.arrayIndex;
                    tempRow= generateBodyRow(tempBranded);
                    $('#snacks-body tr').eq(replaceIndex).before(tempRow);
                    $('#snacks-body tr').eq(replaceIndex+1).remove();
                } else if(e.databaseType == 'common'){
                    console.log('enteredCommon');
                    let tempCommon;
                    for(let i = 0; i<snacksFoods.length;i++){
                        console.log('snacks loop index' + i)
                        if(snacksFoods[i].databaseType == 'common'){
                            if(snacksFoods[i].tags.tag_id == e.tags.tag_id){
                                tempCommon = snacksFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                replaceIndex = tempCommon.arrayIndex;
                                console.log('temp quanity before',snacksFoods[replaceIndex].quantity);
                                console.log('daily quantity before', dailyFoods[replaceIndex].quantity);
                                snacksFoods[replaceIndex].quantity += e.quantity;
                                console.log('selected array quantity',e.quantity);
                                console.log('temp quantity after', snacksFoods[replaceIndex].quantity);
                                console.log('daily quantity after', dailyFoods[replaceIndex].quantity);
                                tempRow= generateBodyRow(tempCommon);
                                $('#snacks-body tr').eq(replaceIndex).before(tempRow);
                                $('#snacks-body tr').eq(replaceIndex+1).remove();
                                break;
                            }
                        }
                    }
                    console.log('temp quantity afterfor', snacksFoods[replaceIndex].quantity);
                    console.log('daily quantity afterfor', dailyFoods[replaceIndex].quantity);
                }
            } else{
                countDaily = 0;
                for(let i = 0; i<dailyFoods.length; i++){
                    if(dailyFoods[i].databaseType == 'common'){
                        if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                            countDaily++;
                            break;
                        }
                    } else if(dailyFoods[i].databaseType == 'branded'){
                        if(dailyFoods[i].nix_item_id == e.nix_item_id){
                            countDaily++;
                            break;
                        }
                    }
                }
                if(countDaily > 0){
                    if(e.databaseType == 'branded' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].nix_item_id == e.nix_item_id){
                                    tempDaily = dailyFoods.find(x => x.nix_item_id === e.nix_item_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } else if(e.databaseType == 'common' && dailyFoods.length>0){
                        let tempDaily;
                        for(let i = 0; i<dailyFoods.length;i++){
                            if(dailyFoods[i].databaseType == 'common'){
                                if(dailyFoods[i].tags.tag_id == e.tags.tag_id){
                                    tempDaily = dailyFoods.find(x => x.tags.tag_id === e.tags.tag_id);
                                    replaceIndex = tempDaily.arrayIndex;
                                    dailyFoods[replaceIndex].quantity += e.quantity;
                                    break;
                                }
                            }
                        }
                    } 
                }
                else{
                    dailyFoods.push(e);
                    dailyFoods[dailyFoods.length-1].arrayIndex = dailyFoods.length-1;
                }
                snacksFoods.push(e);
                snacksFoods[snacksFoods.length-1].arrayIndex = snacksFoods.length-1;
                snacksBody.append(tempRow);
            }
            console.log('temp quantity after everything', snacksFoods[replaceIndex].quantity);
            console.log('daily quantity after everything', dailyFoods[replaceIndex].quantity);
            console.log('selected array', selectedArray);
            console.log('snacks foods',snacksFoods);
            console.log('daily foods', dailyFoods);
        }); 
        snacksCalories.text(sCalories.toFixed(2));
        totalCals();
    }
    dailyNutrients = {
        calories: 0,
        cholesterol: 0,
        dietary_fiber: 0,
        potassium: 0,
        protein: 0,
        saturated_fat: 0,
        sodium: 0,
        sugar: 0,
        carbohydrates: 0,
        total_fat: 0
    }
    for(let i = 0; i <dailyFoods.length; i++){
        addNutrients(dailyFoods[i]);
    }
    console.log(dailyNutrients);
    selectedArray=[];
});
$('#water-submit-btn').on('click', function(e){
    console.log('clicked');
    console.log($('#water-modal').find('#amount-water'));
    let addWater = parseInt($('#water-modal').find('#amount-water')[0].value)
    console.log(addWater);
    console.log(waterAmount);
    waterAmount += addWater;
    let tempWaterRow = generateWaterRow(waterAmount);
    if(waterBody.find('tr').length == 0 && waterAmount > 0){
    waterBody.append(tempWaterRow);
    } else if(waterBody.find('tr').length > 0 && waterAmount > 0){
        waterBody.append(tempWaterRow);
        $('#water-body tr').eq(0).remove();
    }
})
$('#quick-add-one').on('click',function(e){
    waterAmount += 1;
    console.log(waterAmount);
    let tempWaterRow = generateWaterRow(waterAmount);
    if(waterBody.find('tr').length == 0){
    waterBody.append(tempWaterRow);
    } else{
        waterBody.append(tempWaterRow);
        $('#water-body tr').eq(0).remove();
    }
})
$('#quick-add-two').on('click',function(e){
    waterAmount += 2;
    console.log(waterAmount);
    let tempWaterRow = generateWaterRow(waterAmount);
    if(waterBody.find('tr').length == 0){
    waterBody.append(tempWaterRow);
    } else{
        waterBody.append(tempWaterRow);
        $('#water-body tr').eq(0).remove();
    }
})
$('#quick-add-four').on('click',function(e){
    waterAmount += 4;
    console.log(waterAmount);
    let tempWaterRow = generateWaterRow(waterAmount);
    if(waterBody.find('tr').length == 0){
    waterBody.append(tempWaterRow);
    } else{
        waterBody.append(tempWaterRow);
        $('#water-body tr').eq(0).remove();
    }
})
function generateWaterRow(amount){
    return `<tr id="water-row">
    <td>${amount} Cups</td>
    </tr>
    `
}
// $('.food-table').mouseover(function(e){
//     console.log('mouseover', e);
// })
// $('.food-table').on('hover','.meal-body-row',function(e){
//     console.log('mouseover',e);
// })

