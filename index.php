<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>NUTRI TRACK</title>
  <meta name="vie`wport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ" crossorigin="anonymous">
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="bootstrap.css" />
  <script src="https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.2.0/firebase-firestore.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.2.0/anime.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js"></script>
</head>


  
<body class="body-fixed">
  <div id="login-modal" class="login-modal">
    <div id="login-bg"></div>
    <div id="login-content">
      <div id="login-input-container">
        <h3>Enter your username and password:</h3>
        <form id="login-input">
		<input type="text" placeholder="username" name="login-username" id="login-username" autocomplete="off" required value="cdyoung1" />
          <input type="password" placeholder="password" name="login-password" id="login-password" autocomplete="current-password" minlength="4" maxlength="20" size="20" required value="hello">
          <input type="submit" name="submit" id="submit" />
		<!--<input type="text" placeholder="Username" id="txtusername" style="width:50%"><br><br>
					<input type="password" placeholder="Password" id="txtpassword" style="width:50%"><br><br>
					<input type="submit" id="btnsubmit" value="SUBMIT" onclick="checkLogin()">-->
        </form>
      </div>
    </div>
  </div>

  <div id="nav">
    <h3>NUTRI TRACK</h3>
    <div id="nav-container">
      <div id="nav-btn"><i class="fas fa-bars"></i></div>
      <ul id="nav-list">
        <li><a href="#">Home</a></li>
        <li><a href="nr.php">Water Tracker</a></li>
        <li><a href="\nt\MealPlanner-master\index.html">Meal Planner</a></li>
        <!--<li><a href="#">Fitness Log</a></li>-->
        <li><a id="sign-out-btn"><i class="fas fa-sign-out-alt"></i></a></li>
      </ul>
    </div>
  </div>
  <div id="home-page" class="text-center">
    <h1 id="title" class="">NUTRI TRACK</h1>
    <div id="streak-container">
	  <!--<h4 id="streak-count">You logged your food intake for 0 days!</h4>-->
    </div>
    <div id="date-row">
      <div id="date-container">
        <div class="prev arrow"><i class="fas fa-arrow-left"></i></div>
        <div id="date">
          <form id="date-picker">
            <input type="date" name="date-selector" id="date-selector"/>
          </form>
        </div>
        <div class="next arrow"><i class="fas fa-arrow-right"></i></div>
        <div id="calendar"><i class="fas fa-calendar-alt"></i></div>
      </div>
      <div id="calorie-container">
        <div id="calorie-bar-container">
          <div id="calorie-bar"></div>
        </div>
        <div>
          <p id='calorie-proportion'></p>
        </div>
      </div>
    </div>
    <div id="food-row">
      <div id="food-container">
        <div id="breakfast-container" class="food">
          <table id="breakfast-table" class="food-table breakfast">
            <thead class="meal-header">
                <th>Breakfast</th>
                <th id="breakfast-calories" class="header-calories"></th>
            </thead>
            <tbody id="breakfast-body">
            </tbody>
            <tfoot>
              <td class="add-btn" colspan=2>
                <div class="add" ><i class="fas fa-plus"></i></div>
                <p>Add Food</p>
              </td>
            </tfoot>         
          </table>
        </div>
        <div id="lunch-container" class="food">
          <table id="lunch-table" class="food-table">
            <thead class="meal-header">
              <th>Lunch</th>
              <th id="lunch-calories" class="header-calories"></th>
            </thead>
            <tbody id="lunch-body">
            </tbody>
            <tfoot>
              <td class="add-btn" colspan=2>
                <div class="add" ><i class="fas fa-plus"></i></div>
                <p>Add Food</p>
              </td>
            </tfoot>
          </table>
        </div>
        <div id="dinner-container" class="food">
          <table id="dinner-table" class="food-table">
            <thead class="meal-header">
                <th>Dinner</th>
                <th id="dinner-calories" class="header-calories"></th>
            </thead>
            <tbody id="dinner-body">
            </tbody>
            <tfoot>
              <td class="add-btn" colspan=2>
                <div class="add"><i class="fas fa-plus"></i></div>
                <p>Add Food</p>
              </td>
            </tfoot>          
          </table>
        </div>             
        <div id="snacks-container" class="food">
          <table id="snacks-table" class="food-table">
            <thead class="meal-header">
              <th>Snacks</th>
              <th id="snacks-calories" class="header-calories"></th>
            </thead>
            <tbody id="snacks-body">
            </tbody>
            <tfoot>
              <td class="add-btn" colspan=2>
                <div class="add"><i class="fas fa-plus"></i></div>
                <p>Add Food</p>
              </td>
            </tfoot>           
          </table>
        </div>
        <div id="water-container" class="food">
         <!-- <table id="water-table" class="food-table">
            <thead>
              <th>Water</th>
            </thead>
            <tbody id="water-body">
            </tbody>
            <tfoot>
              <td class="water-btn">
                <div class="add"><i class="fas fa-plus"></i></div>
                <p>Add Water</p>
              </td>
            </tfoot>         
          </table>-->
        </div>                                
      </div>
    </div>
  </div>
  <div id="item-modal" class="modal hidden">
    <div class="modal-bg"></div>
    <div class="modal-content">
      <div class="input-container">
        <div id="food-form">
          <div id="meal-select">
            <button id="breakfast-select" class="meal-select select-btn">Breakfast</button>
            <button id="lunch-select" class="meal-select select-btn">Lunch</button>
            <button id="dinner-select" class="meal-select select-btn">Dinner</button>
            <button id="snacks-select" class="meal-select select-btn">Snacks</button>
          </div>
          <form id="food-input" class="modal-form">
            <input type="text" placeholder="Search Food" name="food-name" id="search" autocomplete="off"required/>
            <!-- <input type="number" placeholder="Number of Servings" step="any" min="0" name="servings" id="food-servings" required/> -->
            <!-- <input type="submit" id="food-submit" class="submit-btn btn" /> -->
          </form>
         <div id="search-results">
            <table id="common-table">
              <thead>
                <th colspan='2'>Common Foods</th>
              </thead>
              <tbody id="common-body"></tbody>
            </table>
            <table id="branded-table">
              <thead>
                <th colspan='2'>Branded Foods</th>
              </thead>
              <tbody id="branded-body"></tbody>
            </table>
          </div>
        </div>
      </div>
      <div id="selected-container">
        <table id="selected-results">
          <thead>
            <th id="food-header" colspan='2'>Selected Foods</th>
            <th id="servings-header">Number of Servings</th>
          </thead>
          <tfoot>
            <tr>
              <th colspan='3'><button class='btn select-btn' id='submit-selected'>Submit</button></th>
            </tr>
          </tfoot>
          <tbody id="selected-body"></tbody>
        </table>
      </div>
    </div>
  </div>
  <div id="water-modal" class="modal hidden">
    <div class="modal-bg"></div>
    <div class="modal-content">
      <div class="input-container">
        <div id="water-form">
          <form id="water-input" >
            <input type="number" placeholder="Amount of Water" step="1" min="0" name="amount-water" value='0' id="amount-water" required/>
            <h4>Cup(s)</h4>
            <button class="submit-btn btn" id="water-submit-btn">Submit</button>
            <!-- <input type="submit" class="submit-btn btn" id="water-submit-btn"/> -->
           </form>
          <div id="water-select">
            <button id="quick-add-one" class="quick-add-btn select-btn">+1 Cup</button>
            <button id="quick-add-two" class="quick-add-btn select-btn">+2 Cups</button>
            <button id="quick-add-four" class="quick-add-btn select-btn">+4 Cups</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
			/*function checkLogin(){ 
				if($("#text").val()==""){
					alert("Please Enter Username");
				}
				else if($("#password").val()==""){
					alert("Please Enter Password");
				}
				else{
					$.ajax({
						type:"POST",
						url:"checkLogin.php",
						data:{username:$("#text").val(),password:$("#password").val()},
						success:function(response){
							console.log(response);
							if($.trim(response)=="Success"){
							alert('Login Successful');	
							$("#text").val("");
							$("#password").val("");
							//$(location).attr('href','Home.php');
							}
							else{
								alert("Password");
								$("#text").val("");
								$("#password").val("");
							}
						}
					});
				}
			}*/
	</script>
</body>
</html>
