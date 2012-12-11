var cardNumberCallback, creditCardValidation;

var creditCardType = Class.create({

    initialize: function (result) {
        console.log(result);
        this.result = result;
        this.cards = $$('.card li');
        this.formField = $('card_number');

        if(!(this.result.card_type !== null)){
            this.cards.invoke('removeClassName','off');
            this.formField.removeClassName('valid');
            return;
        }

        this.cards.invoke('addClassName','off');

        $$('.cards .' + this.result.card_type.name).invoke('removeClassName','off');

        if(this.result.length_valid && this.result.luhn_valid){
            return this.formField.addClassName('valid');
        }else{
            return this.formField.removeClassName('valid');
        }
    }

});

Event.observe(window, 'load', function () {



}.bind(window));

Event.observe(window, 'load', function () {

    cardNumberCallback = new creditCardType();
    creditCardValidation = new blueAcornValidateCreditCard(cardNumberCallback, $('card_number'));

}.bind(window));