class MysteryHost {
//todo:
//  add scene transitions or a delay so you can't click the button too quickly

	numPlayers;
	gotPlayers;
	playerNames = ["","","","","","","","","",""];
	playerCharacters = [null,null,null,null,null,null,null,null,null,null];
	container;
	instructionDiv;
	wordDiv;
	buttonDiv;
	act;
	whodoneit = null;

    characters = ["Margaret Paige Turner","Bruce Skippy Johnson","Agnes Paige Turner","Clive Paige Turner","Jacqueline de Montfort","Gregory King","Patrick de Montfort","Louisa de Montfort","Tarquin Uppity","Julia Bishop"];
    relationships = ["Barbara's daughter","Margaret's lover","Barbara's sister","Barbara's son","Barbara's daughter-in-law, married to Clive","Engaged to Louisa, Barbara's granddaughter","Barbara's grandson","Barbara's granddaughter","Barbara's old friend","Agnes' carer"];
    plots = ["X","VII","II","VI","III","IV","VIII","V","IX","I"];

	constructor () {
        //set 'enter' key to trigger first button
        document.addEventListener("keypress", this.clickButton);

        //add reset button
		if (!document.getElementById("mhreset")) {
			let addme = document.createElement("input");
			addme.id = "mhreset";
			addme.setAttribute("type","button");
			addme.setAttribute("class","reset");
			addme.value = "reset game";
			document.body.append(addme);
		}
		let resetbutton = document.getElementById("mhreset");
        //resetbutton.addEventListener("click",() => this.confirmReset());

/*        //add dialog box
		if (!document.getElementById("mhconfirm")) {
			let addme = document.createElement("dialog");
			addme.id = "mhreset";
        <!-- Simple pop-up dialog box -->
<dialog id="dialog">
  <form method="dialog">
    <button type="submit">Close</button>
  </form>
</dialog>
*/
        const resetModal = document.querySelector('#mhresetmodal');
        const resetConfirm = document.querySelector('#mhresetmodal .reset');
        const closeButton = document.querySelector('#mhresetmodal .continue, #mhresetmodal .close');

        resetbutton.addEventListener("click",() => {
            resetModal.showModal();
        });
        let mh=this;
        closeButton.addEventListener('click', () => {
            resetModal.close();
        });
        resetConfirm.addEventListener('click', () => {
            resetModal.close();
            mh.resetGame();
        });



	  this.init();
	}
	init() {
		this.#loadSettings();
		this.#loadFromStorage();

		if (!document.getElementById("mysteryhost")) {
			let addme = document.createElement("div");
			addme.id = "mysteryhost";
			addme.setAttribute("class","container");
			document.body.append(addme);
		}
		this.container = document.getElementById("mysteryhost");
		this.container.innerHTML = '<div class="instructions"></div>'+"\n"+
		    '<form id="mhform" onsubmit="return false;">'+"\n"+
			'<div class="words"><img src="img/Loading_icon.gif"/></div>'+"\n"+
			'<div class="buttons"></div>'+"\n"+
		    '</form>'+"\n";
		this.buttonDiv = this.container.querySelector(".buttons");
		this.wordDiv = this.container.querySelector(".words");
		this.instructionDiv = this.container.querySelector(".instructions");

        //adjust for header impeding on viewport
        let hdiff = window.innerHeight - this.container.offsetHeight;
//console.log(hdiff + " = " + window.innerHeight +" - "+this.container.offsetHeight);
        if (hdiff > 0) {
            this.buttonDiv.style.bottom = hdiff+"px";
        }

        this.beginAct();
	}

	beginAct() {
	  this.#saveToStorage();
	  switch(this.act) {
	    case(1):
          this.startActOne();
	      break;
	    case(2):
	      this.startActTwo();
	      break;
	    case(3):
	      this.startActThree();
	      break;
	    case(4):
	      this.startActFour();
	      break;
	    default: //act 0
          //resume where we left off
          if (this.gotPlayers > 0) {
            this.assignPlayer(this.gotPlayers);
          } else {
            this.getPlayers();
          }
	  }

	}

	startActOne() {
      this.instructionDiv.innerHTML = "<h1>Round One</h1><h2>Mingling</h2>"+
        "Eat, drink, and be merry! Get into character. Read your character sheets and chat with the other guests.";

	  this.wordDiv.innerHTML = this.getCharacterTable();
	  this.buttonDiv.innerHTML = "<input type='button' class='ok' value='Continue to Round Two'/>";
      let b8 = this.buttonDiv.querySelector("input.ok");
      if (b8) { b8.addEventListener("click",() => this.nextRound()); }
    }

    getCharacterTable() {
      let rval = "<table class='characters'>";
      /*
      //player order
	  for (let i=0;i<this.numPlayers;i++) {
	    rval += "<tr>"+
	      "<td class='character'>"+this.characters[this.playerCharacters[i]]+"</td>"+
	      "<td class='relationship'>"+this.relationships[this.playerCharacters[i]]+"</td>"+
	      "<td class='name'>"+this.playerNames[i]+"</td>"+
          "</tr>";
	  }
	  */
	  //character order
	  let maxPlayers = this.characters.length;
	  for (let i=0;i<maxPlayers;i++) {
	    if (!this.playerCharacters.includes(i)) { continue; }
	    rval += "<tr>"+
	      "<td class='character'>"+this.characters[i]+"</td>"+
	      "<td class='relationship'>"+this.relationships[i]+"</td>"+
	      "<td class='name'>"+this.playerNames[this.playerCharacters.indexOf(i)]+"</td>"+
          "</tr>";
      }
	  rval += "</table>";
	  return rval;
	}

    nextRound() {
      this.act++;
      this.#saveToStorage();
      this.beginAct();
    }

	startActTwo() {
      this.instructionDiv.innerHTML = "<h1>Round Two</h1><h2>BARBARA PAIGE TURNER MURDERED!</h2>"+
        "Read Plot "+this.plots[this.whodoneit]+
        ", and review the map";
	  this.wordDiv.innerHTML = this.getCharacterTable();
	  this.buttonDiv.innerHTML = "<input type='button' class='ok' value='Continue to Round Three'/>";
      let b9 = this.buttonDiv.querySelector("input.ok");
      if (b9) { b9.addEventListener("click",() => this.nextRound()); }
    }

	startActThree() {
      this.instructionDiv.innerHTML = "<h1>Round Three</h1><h2>Interrogation</h2>"+
        "Question your fellow guests, then write down your accusation.";
	  this.wordDiv.innerHTML = this.getCharacterTable();
	  this.buttonDiv.innerHTML = "<input type='button' class='ok' value='Continue to Round Four'/>";
      let b9 = this.buttonDiv.querySelector("input.ok");
      if (b9) { b9.addEventListener("click",() => this.nextRound()); }
    }

	startActFour() {
      this.instructionDiv.innerHTML = "<h1>Round Four</h1><h2>Solutions & Confessions</h2>"+
        "Read the accusations. The murderer should confess in the way of their choosing."+
        "<br/><br/><div class='center'>spoiler: <span class='spoiler' title='spoiler text -- highlight to reveal'>The murder was committed by "+this.characters[this.playerCharacters[this.whodoneit]]+", played by "+this.playerNames[this.whodoneit]+"</span></div>";
	  this.wordDiv.innerHTML = this.getCharacterTable();
	  this.buttonDiv.innerHTML = "<br/><br/><br/>";
    }


	getPlayers() {
	  this.instructionDiv.innerHTML = "Welcome to this <span class='spooky'>Murder Mystery</span>! Please get out your copy of \"Complete Murder Mystery Night\"<br/><br/>How many guests are there?";
	  this.wordDiv.innerHTML = "<input type='number' name='numPlayers' id='numPlayers' min='3' max='10'/>";
	  this.buttonDiv.innerHTML = "<input type='button' class='start' value='Begin the Game'/>";
      let np = document.getElementById("numPlayers");
	  if (this.numPlayers) {
        np.value = this.numPlayers;
      }
      np.focus();
      let b1 = this.buttonDiv.querySelector("input.start");
      if (b1) { b1.addEventListener("click",() => this.startPlayers()); }

    }

    startPlayers() {
      let npval;
      let np = document.getElementById("numPlayers");
      if (np) {
        npval = np.value;
        if (npval >=3 && npval <=10) {
          this.numPlayers = npval;
        }
      }
      this.#saveToStorage();
      if (!(this.numPlayers >=3 && this.numPlayers <=10)) {
        this.getPlayers();
        return;
      }
      this.gotPlayers = 0;
      //assign who done it
      this.whodoneit = this.whodoneit === null ? Math.floor(Math.random() * this.numPlayers) : this.whodoneit;

      this.assignPlayer(0);
    }

    assignPlayer(thisplayer) {
      this.#saveToStorage();
      let guest = 1*1+thisplayer;
	  this.instructionDiv.innerHTML = "Welcome to this <span class='spooky'>Murder Mystery</span>!<br/>You are guest number "+
	    guest+
	    " out of "+
	    this.numPlayers+
	    "<br/>What is your name?";
	  this.wordDiv.innerHTML = "<input type='text' name='player["+thisplayer+"]' id='playerName' value='"+this.playerNames[thisplayer]+"'/>";
	  this.buttonDiv.innerHTML = "<input type='button' class='start' value='Submit name'/>";
	  document.getElementById("playerName").focus();
      let b2 = this.buttonDiv.querySelector("input.start");
      if (b2) { b2.addEventListener("click",() => this.assignCharacter(thisplayer)); }
	}

    assignCharacter(thisplayer) {
      let pnval;
      let pn = document.getElementById("playerName");
      if (pn) {
        pnval = pn.value;
        if (pnval.length > 0) {
          this.playerNames[thisplayer] = pnval;
        }
      }

      this.#saveToStorage();
      if (!(this.playerNames[thisplayer].length > 0)) {
        this.assignPlayer(thisplayer);
        return;
      }

      if (this.playerCharacters[thisplayer] == null) {
        this.playerCharacters[thisplayer] = this.randCharacter();
      }

	  this.instructionDiv.innerHTML = "Welcome, "+this.playerNames[thisplayer]+".<br/>"+
	  	    "Your character is <span class='charname'>"+
	  	    this.characters[this.playerCharacters[thisplayer]]+
	  	    "</span>.<br/>"+
	  	    "If you're unhappy with this selection, you may reroll your character. Otherwise, continue to reveal whether you are the murderer.";
	  this.wordDiv.innerHTML = "";
	  this.buttonDiv.innerHTML = "<input type='button' class='continue' value='Continue'/><br/><input type='button' class='reroll' value='Reroll'/><br/><input type='button' class='back' value='Change Name'/>";
      let b3 = this.buttonDiv.querySelector("input.reroll");
      if (b3) { b3.addEventListener("click",() => this.reroll(thisplayer)); }
      let b4 = this.buttonDiv.querySelector("input.continue");
      if (b4) { b4.addEventListener("click",() => this.assignMurderer(thisplayer)); }
      let b4b = this.buttonDiv.querySelector("input.back");
      if (b4b) { b4b.addEventListener("click",() => this.assignPlayer(thisplayer)); }

    }

    assignMurderer(thisplayer) {
      this.#saveToStorage();
      this.instructionDiv.innerHTML = "Greetings to you, <span class='charname'>"+
	  	    this.characters[this.playerCharacters[thisplayer]]+
	  	    "</span>.<br/>"+
	  	    "Are you in private?";
	  this.wordDiv.innerHTML = "";
	  this.buttonDiv.innerHTML = "<input type='button' class='yes' value='Yes'/>";
      let b5 = this.buttonDiv.querySelector("input.yes");
      if (b5) { b5.addEventListener("click",() => this.revealMurderer(thisplayer)); }
    }
    revealMurderer(thisplayer) {
      this.instructionDiv.innerHTML = thisplayer==this.whodoneit ? "<u>You <span class='spooky'>are the murderer</span></u>" : "You <span class='green'>are not</span> the murderer";
	  this.wordDiv.innerHTML = "";
	  this.buttonDiv.innerHTML = "<input type='button' class='ok' value='OK'/>";
      let b6 = this.buttonDiv.querySelector("input.ok");
      if (b6) { b6.addEventListener("click",() => this.passTheComp(thisplayer)); }
    }

    passTheComp(thisplayer) {
      thisplayer++;
      this.gotPlayers++;
	  this.wordDiv.innerHTML = "";
	  this.buttonDiv.innerHTML = "<input type='button' class='ok' value='OK'/>";
      let b7 = this.buttonDiv.querySelector("input.ok");
      if (thisplayer>=this.numPlayers) {
        this.act = 1;
        this.instructionDiv.innerHTML = "You are done with setup, and all the guests have been greeted. Continue to the game.";
        if (b7) { b7.addEventListener("click",() => this.beginAct()); }
      } else {
        this.instructionDiv.innerHTML = "You are done entering your name. Please pass the computer to the next player.";
        if (b7) { b7.addEventListener("click",() => this.assignPlayer(thisplayer)); }
      }
    }

    randCharacter() {
      let supp = Math.floor(Math.random() * this.numPlayers);
      return this.playerCharacters.includes(supp) ? this.randCharacter() : supp;
    }

    reroll(thisplayer) {
        this.playerCharacters[thisplayer] = null;
        this.assignCharacter(thisplayer);
    }


	static formatTime(elapsed) {
		let displayTime = elapsed+" seconds";
		let seconds = elapsed % 60;
		let minutes = parseInt(elapsed/60) % 60;
		let hours = parseInt(minutes/3600);
		if (hours > 0) {
			displayTime = hours.toString() + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
		} else {
			displayTime = minutes.toString().padStart(1, '0') + ":" + seconds.toString().padStart(2, '0');
		}
		return displayTime;
	}
	static secondsToWords(elapsed) {
		if (!(elapsed>0)) { return "no time"; }
		let displayTime = "";
		let seconds = elapsed % 60;
		let minutes = parseInt(elapsed/60) % 60;
		let hours = parseInt(elapsed/3600);
		let separator = (hours>0 && minutes>0 && seconds>0 ? "," : "");
		if (hours > 0) {
			displayTime += hours.toString() + " hour";
			displayTime += (hours > 1 ? "s" : "");
			displayTime += separator;
			if (minutes > 0) {
				displayTime += (seconds > 0 ? " " : " and ");
			} else {
				displayTime += (seconds > 0 ? " and " : "");
			}
		}
		if (minutes > 0) {
			displayTime += minutes.toString() + " minute";
			displayTime += (minutes > 1 ? "s" : "");
			displayTime += separator;
			displayTime += (seconds > 0 ? " and " : "");
		}
		if (seconds > 0) {
			displayTime += seconds.toString() + " second";
			displayTime += (seconds > 1 ? "s" : "");
		}
		return displayTime;
	}

	showWords() {
		if (this.mywords) {
			this.words = "<p>"+this.mywords.join("</p><p>")+"</p>";
		} else {
			this.words = "";
		}
	}
	hideWords() {
		this.words = "";
	}

    clickButton(event) {
          // If the user presses the "Enter" key on the keyboard
          if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click

            let btn = document.querySelector("#mysteryhost .buttons input[type='button'],#mysteryhost .buttons button");
            btn.click();
          }
    }

	confirmReset() {
/*
	  if (confirm("Reset the game?")) {
	    this.resetGame();
	  }
*/



	}
	resetGame() {
      localStorage.clear();
	  this.numPlayers = null;
	  this.gotPlayers = null;
      this.playerNames = ["","","","","","","","","",""];
  	  this.playerCharacters = [null,null,null,null,null,null,null,null,null,null];
	  this.act = null;
	  this.whodoneit = null;

      this.init();
	}


	#saveToStorage() {
		localStorage.setItem("numPlayers", this.numPlayers);
		localStorage.setItem("gotPlayers", this.gotPlayers);
		localStorage.setItem("playerNames", JSON.stringify(this.playerNames));
		localStorage.setItem("playerCharacters", JSON.stringify(this.playerCharacters));
		localStorage.setItem("act", this.act);
		localStorage.setItem("whodoneit", this.whodoneit);
	}
	#loadFromStorage() {
		let numPlayers = parseInt(localStorage.getItem("numPlayers"));
		this.numPlayers = Number.isInteger(numPlayers) ? numPlayers : this.numPlayers;
		let gotPlayers = parseInt(localStorage.getItem("gotPlayers"));
		this.gotPlayers = Number.isInteger(gotPlayers) ? parseInt(gotPlayers) : this.gotPlayers;
        let playerNames = JSON.parse(localStorage.getItem("playerNames"));
		this.playerNames = playerNames ? playerNames : this.playerNames;
        let playerCharacters = JSON.parse(localStorage.getItem("playerCharacters"));
		this.playerCharacters = playerCharacters ? playerCharacters : this.playerCharacters;
		let act = parseInt(localStorage.getItem("act"));
		this.act = Number.isInteger(act) ? parseInt(act) : this.act;
		let whodoneit = parseInt(localStorage.getItem("whodoneit"));
		this.whodoneit = Number.isInteger(whodoneit) ? parseInt(whodoneit) : this.whodoneit;
	}
	#saveSettings() {
		//localStorage.setItem("numPlayers", this.numPlayers);
		//localStorage.setItem("act", this.act);
	}
	#loadSettings() {
		//let numPlayers = localStorage.getItem("numPlayers");
		//this.numPlayers = numPlayers ? numPlayers : this.numPlayers;
		//let act = localStorage.getItem("act");
		//this.act = act ? act : this.act;
	}

}
