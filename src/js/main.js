;(function( window ) {

	var Calculator = {

		// Containers
		$history : $('.history-content'),
		$current : $('.current h3'),
		$operation : $('.operation h4'),

		// Buttons
		$numbers : $('.number'),
		$operators : $('.operator'),

		// Data
		operationDisplay : '',
		currentNumber : '',
		currentOperator : '',
		firstNumber : 0,
		secondNumber : 0,
		total : 0,

		// Validator
		nextIsOperator : false,
		comeFromEqual : false,

		// Functions
		init : function() {

			var self = this;

			this.$numbers.on( 'click', function( evt ) {

				evt.preventDefault();

				if ( self.comeFromEqual )
					self.resetCalc();

				var number = $( this ).find('span').html();

				self.currentNumber += number;
				self.$current.html( self.currentNumber );

				self.nextIsOperator = true;
				self.comeFromEqual = false;

			});

			this.$operators.on( 'click', function( evt ) {

				evt.preventDefault();

				var operatorId = $( this ).attr('id');

				self.operatorAction( operatorId );

			});

		},

		canOperate : function() {

			return this.firstNumber !== 0 && this.secondNumber !== 0 &&
						 this.operator !== '';

		},

		operatorAction : function( id ) {

			var self = this;

			var operate = function( operator, isEqualButton ) {

				if ( !self.nextIsOperator && !isEqualButton ) {

					self.currentOperator = operator;
					self.operationDisplay = self.operationDisplay.slice( 0, -1) + $('#' + operator).find('span').html();

					self.$operation.html( self.operationDisplay );

					return;

				} else if ( !self.nextIsOperator && isEqualButton ) {

					return;
				}

				self.nextIsOperator = false;
				self.operationDisplay += ' ' + self.currentNumber;

				if ( !isEqualButton ) {
					self.operationDisplay += ' ' + $('#' + operator).find('span').html();
					self.comeFromEqual = false;
				}

				if ( self.currentOperator == '' ) {

					self.firstNumber = parseFloat( self.currentNumber );

					self.currentOperator = operator;

				} else {

					self.secondNumber = parseFloat( self.currentNumber );

					self.equal();

					if ( !isEqualButton ) {

						self.currentOperator = operator;

					} else {

						self.currentOperator = '';
						self.nextIsOperator = true;
						self.comeFromEqual = true;

						self.pushHistoryItem();

					}
				}

				self.$operation.html( self.operationDisplay );
				self.currentNumber = '';

			}

			switch ( id ) {
				case 'ce':

					if ( this.currentNumber.length > 1 ) {

						this.currentNumber = this.currentNumber.slice( 0, -1);
						this.$current.html( this.currentNumber );

					} else {

						this.currentNumber = '';
						this.$current.html('0');

					}

					break;
				case 'c':

					this.resetCalc();

					break;
				case 'equal':

					operate( id, true );

					break;
				default:
					operate( id, false );

			}

		},

		equal : function() {

			if ( this.total !== 0 )
				this.firstNumber = this.total;

			switch ( this.currentOperator ) {
				case 'mod':
					this.total = this.firstNumber % this.secondNumber;
					break;
				case 'div':
					this.total = this.firstNumber / this.secondNumber;
					break;
				case 'pro':
					this.total = this.firstNumber * this.secondNumber;
					break;
				case 'min':
					this.total = this.firstNumber - this.secondNumber;
					break;
				case 'plus':
					this.total = this.firstNumber + this.secondNumber;
					break;
				default:

			}

			this.secondNumber = 0;

			this.$current.html( this.total );

		},

		pushHistoryItem : function() {

			var html = '<div class="history-item"><h4>' + this.operationDisplay + ' = ' + this.total + '</h4></div>';

			this.$history.prepend( html );
			this.$history.children(0).slideDown('slow');

		},

		resetCalc : function() {

			this.currentNumber = '';
			this.currentOperator = '';
			this.operationDisplay = '';
			this.firstNumber = 0;
			this.secondNumber = 0;
			this.total = 0;
			this.$current.html('0');
			this.$operation.html('');

		}

	};

	window.Calculator = Calculator;
	window.Calculator.init();


})( window );
