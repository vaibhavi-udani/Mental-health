var config = {
    apiKey: "AIzaSyBlMJp9jBQyHUH8Khcqv8p09quHbDChXYc",
    authDomain: "my-food-nutrition-tracker.firebaseapp.com",
    databaseURL: "https://my-food-nutrition-tracker.firebaseio.com",
    projectId: "my-food-nutrition-tracker",
    storageBucket: "my-food-nutrition-tracker.appspot.com",
    messagingSenderId: "488189533802"
};
firebase.initializeApp(config);
let db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

const loginForm = $('#login-input');
const users = db.collection('users');

let username, findUser, selectedDate, dateValue, dateSelector;
let breakfast, lunch, dinner, snacks, water;
let dateDoc, bNutrition, lNutrition, dNutrition, sNutrition, wConsumption;
function padMonth (month){
    if((month.getMonth()+1)<10){
        return '0' + (month.getMonth()+1);
    } else{
        return month.getMonth()+1;
    }
}
function padDate (date){
    if(date.getDate()<10){
        return '0' + date.getDate();
    } else{
        return date.getDate();
    }
}
function defaultDate(){
    dateValue = '';
    dateSelector = '';
    selectedDate = new Date();
    dateValue += selectedDate.getFullYear() + '-' + padMonth(selectedDate) + '-' + padDate(selectedDate);
    dateSelector += selectedDate.getFullYear()+padMonth(selectedDate) + padDate(selectedDate)
    $('#date-picker').find('#date-selector')[0].value = dateValue;
}
$('.prev').on('click', function(e){
    dateValue = '';
    dateSelector = '';
    console.log('before', selectedDate);
    selectedDate.setDate(selectedDate.getDate()-1);
    console.log('after', selectedDate);
    dateValue += selectedDate.getFullYear() + '-' + padMonth(selectedDate) + '-' + padDate(selectedDate);
    dateSelector += selectedDate.getFullYear()+padMonth(selectedDate) + padDate(selectedDate)
    $('#date-picker').find('#date-selector')[0].value = dateValue;
    console.log($('#date-picker').find('#date-selector')[0].value);
    loadData(dateSelector);
})
$('.next').on('click', function(e){
    dateValue = '';
    dateSelector = '';
    console.log('before', selectedDate);
    selectedDate.setDate(selectedDate.getDate()+1);
    console.log('after', selectedDate);
    dateValue += selectedDate.getFullYear() + '-' + padMonth(selectedDate) + '-' + padDate(selectedDate);
    dateSelector += selectedDate.getFullYear()+padMonth(selectedDate) + padDate(selectedDate)
    $('#date-picker').find('#date-selector')[0].value = dateValue;
    console.log($('#date-picker').find('#date-selector')[0].value);
    loadData(dateSelector);
})
$('#submit').on('click', function(e){
    e.preventDefault();
    defaultDate();
    exists = 0;
    username = loginForm.find('#login-username')[0].value;
    password = loginForm.find('#login-password')[0].value;
    console.log('entered username', username);
    findUser = users.doc(username).get().then(function(doc) {
        if(doc.exists && (doc.data().password == password)){
            console.log('Document data: ', doc.data());
            $('body').removeClass('body-fixed');
            $('#login-modal').addClass('hidden');
            // alert("Successful Login.")
            loadData(dateSelector);
        } else if(doc.exists && (doc.data().password != password)){
            alert("Incorrect Password. Please try again.")
        } else{
            if(confirm('Invalid Login. Would you like to create an account under this username?')){
                $('body').removeClass('body-fixed');
                $('#login-modal').addClass('hidden');
                alert(`Account created under username \'${username}\'.`);  
                users.doc(username).set({
                    username: username,
                    password: password
                })
                loadData(dateSelector);
            }
        }
    }).catch(function(error){
        console.log('Error found: ', error)
    })
    loginForm.find('#login-username')[0].value = '';
    loginForm.find('#login-password')[0].value = '';

})
$('#sign-out-btn').on('click', function(){
    $('body').addClass('body-fixed');
    $('#login-modal').removeClass('hidden');
})
$('#date-selector').change(function(){
    dateValue = '';
    dateSelector = '';
    let tempValue = $('#date-picker').find('#date-selector')[0].value;
    console.log('temp', tempValue);
    let tempYear = parseInt(tempValue.substring(0,4));
    let tempMonth = parseInt(tempValue.substring(5,7))-1;
    let tempDate = parseInt(tempValue.substring(8,10));
    console.log(tempValue);
    selectedDate = new Date(tempYear, tempMonth, tempDate);
    dateValue += selectedDate.getFullYear() + '-' + padMonth(selectedDate) + '-' + padDate(selectedDate);
    dateSelector += selectedDate.getFullYear()+padMonth(selectedDate) + padDate(selectedDate);
    $('#date-picker').find('#date-selector')[0].value = dateValue;
    loadData(dateSelector);
})
function loadData(dateSelector){
    dateDoc = users.doc(username).collection('date').doc(dateSelector);
    dateDoc.get().then(function(doc){
        if(doc.exists){
            dateDoc.set({
                date: parseInt(dateSelector)
            }, {merge: true});
            breakfast = dateDoc.collection('breakfast');
            lunch = dateDoc.collection('lunch');
            dinner = dateDoc.collection('dinner');
            snacks = dateDoc.collection('snacks');
            water = dateDoc.collection('water');
            bNutrition = breakfast.doc('breakfast-nutrition');
            lNutrition = lunch.doc('lunch-nutrition');
            dNutrition = dinner.doc('dinner-nutrition');
            sNutrition = snacks.doc('snacks-nutrition');
            wConsumption = water.doc('water-consumption');
            bNutrition.set({
                calories: 0,
                cholesterol: 0,
                dietary_fiber: 0,
                potassium: 0,
                protein: 0,
                saturated_fat: 0,
                sodium: 0,
                sugars: 0,
                carbohyrdrates: 0,
                total_fat: 0,
            }, {merge: true});
            lNutrition.set({
                calories: 0,
                cholesterol: 0,
                dietary_fiber: 0,
                potassium: 0,
                protein: 0,
                saturated_fat: 0,
                sodium: 0,
                sugars: 0,
                carbohyrdrates: 0,
                total_fat: 0,
            }, {merge: true});
            dNutrition.set({
                calories: 0,
                cholesterol: 0,
                dietary_fiber: 0,
                potassium: 0,
                protein: 0,
                saturated_fat: 0,
                sodium: 0,
                sugars: 0,
                carbohyrdrates: 0,
                total_fat: 0,
            }, {merge: true});
            sNutrition.set({
                calories: 0,
                cholesterol: 0,
                dietary_fiber: 0,
                potassium: 0,
                protein: 0,
                saturated_fat: 0,
                sodium: 0,
                sugars: 0,
                carbohyrdrates: 0,
                total_fat: 0,
            }, {merge: true});
            wConsumption.set({
                quantityCups: 0
            }, {merge: true})
            updateNutrition('breakfast');
            updateNutrition('lunch');
            updateNutrition('dinner');
            updateNutrition('snacks');
        }
    })
function updateNutrition(meal){
    let nutritionData = {
        calories : 0,
        cholesterol : 0,
        dietary_fiber : 0,
        potassium : 0,
        protein : 0,
        saturated_fat : 0,
        sodium : 0,
        sugars : 0,
        carbohyrdrates : 0,
        total_fat : 0,
    }

    dateDoc.collection(`${meal}`).where('type', '==', 'food').get().then((snapshot) => {
        snapshot.forEach(function(foodDoc){
            foodData = foodDoc.data();
            for(let field in nutritionData) {
                nutritionData[field] += foodData[field] * foodData.quantity;
            }
        });

        const mealNutritionDoc = dateDoc.collection(`${meal}`).doc(`${meal}-nutrition`);
        mealNutritionDoc.update(nutritionData)
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(err) {
                console.error(err);
            })
    })
}
function addFood(meal, e){
    dateDoc.collection(`${meal}`).doc(`${e.food_name}`).set({
        calories : e.nf_calories,
        cholesterol : e.nf_cholesterol,
        dietary_fiber : e.nf_dietary_fiber,
        potassium : e.nf_potassium,
        protein : e.nf_protein,
        saturated_fat : e.nf_saturated_fat,
        sodium : e.nf_sodium,
        sugars : e.nf_sugars,
        carbohyrdrates : e.nf_total_carbohydrates,
        total_fat : e.nf_total_fat,
        quantity: e.quantity
    })
}
    // users.doc(username).collection('date').doc(dateSelector).collection('breakfast').doc('chicken').set({
    //     food_name: 'chicken',
    //     calories: 540.14,
    //     cholesterol: 122.04,
    //     dietary_fiber: null,
    //     potassium: 569.52,
    //     protein: 34.28,
    //     saturated_fat: 10.52,
    //     sodium: 791,
    //     sugars: null,
    //     carbohyrdrates: 40.27,
    //     total_fat: 26.56,
    //     quantity: 1,
    //     serving_qty: 1,
    //     serving_unit: 'sandwich',
    //     tag_id: 608,
    //     nix_item_id: null,
    //     type: 'food',
    //     index: 1,
    // }, {merge: true})
    // console.log(users.doc(username).collection('date').doc(dateSelector).collection('breakfast').doc('burger').get().then(function(doc){
    //     if(doc.exists){
    //         console.log(doc.data());
    //     } else{
    //         console.log('No document');
    //     }
    // }).catch(function(error){
    //     console.log("error", error);
    // }))
}
