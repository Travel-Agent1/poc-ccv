var blueAcornValidateCreditCard;

var blueAcornValidateCreditCard = Class.create({

    initialize: function (formField) {
        this.callback = [];
        this.formField = formField;
        this.card_types = [
          {
            name: 'amex',
            pattern: /^3[47]/,
            valid_length: [15],
            short_code: 'AE'
          }, {
            name: 'diners_club_carte_blanche',
            pattern: /^30[0-5]/,
            valid_length: [14]
          }, {
            name: 'diners_club_international',
            pattern: /^36/,
            valid_length: [14]
          }, {
            name: 'jcb',
            pattern: /^35(2[89]|[3-8][0-9])/,
            valid_length: [16]
          }, {
            name: 'laser',
            pattern: /^(6304|670[69]|6771)/,
            valid_length: [16, 17, 18, 19]
          }, {
            name: 'visa_electron',
            pattern: /^(4026|417500|4508|4844|491(3|7))/,
            valid_length: [16],
            short_code: 'VE'
          }, {
            name: 'visa',
            pattern: /^4/,
            valid_length: [16],
            short_code: 'VI'
          }, {
            name: 'mastercard',
            pattern: /^5[1-5]/,
            valid_length: [16],
            short_code: 'MC'
          }, {
            name: 'maestro',
            pattern: /^(5018|5020|5038|6304|6759|676[1-3])/,
            valid_length: [12, 13, 14, 15, 16, 17, 18, 19],
            short_code: 'ME'
          }, {
            name: 'discover',
            pattern: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
            valid_length: [16],
            short_code: 'DI'
          }
        ];

        this.fieldObserver(this.formField);
        this.convertToNumber();
    },

    get_card_type: function(number){
        var card_type, i, _length;
        for(i = 0, _length = this.card_types.length; i < _length; i++){
            card_type = this.card_types[i];
            if(number.match(card_type.pattern)){
                return card_type;
            }
        }
        return null;
    },

    is_valid_luhn: function(number){
        var digit, n, sum, i, _length, _reference;
        sum = 0;
        _reference = number.split('').reverse();
        for (n = _i = 0, _len = _reference.length; _i < _len; n = ++_i) {
            digit = _reference[n];
            digit = +digit;
            if (n % 2) {
                digit *= 2;
                if (digit < 10) {
                    sum += digit;
                } else {
                    sum += digit - 9;
                }
            } else {
                sum += digit;
            }
          }
          return sum % 10 === 0;
    },

    is_valid_length: function(number, card_type){
        var _ref;
        return number.length >= 0 && number.length == card_type.valid_length;
    },

    validate_number: function(number){
        var card_type, length_valid, luhn_valid;
        card_type = this.get_card_type(number);
        luhn_valid = false;
        length_valid = false;
        if(card_type !== null){
            luhn_valid = this.is_valid_luhn(number);
            length_valid = this.is_valid_length(number, card_type);
        }
        this.callback = {
            card_type: card_type,
            luhn_valid: luhn_valid,
            length_valid: length_valid
        };
        this.cardNumberCallback(this.callback);
        return;
    },

    validate: function() {
        var number;
        number = this.normalize(this.formField.getValue());
        return this.validate_number(number);
    },

    normalize: function(number){
        return number.replace(/[ -]/g, '');
    },

    fieldObserver: function(el){
        el.observe('keyup', function(evt){
            this.validate();
        }.bind(this));
        el.observe('change', function(evt){
            this.validate();
        }.bind(this));
    },

    cardNumberCallback: function(result){
        this.cards = $$('.cards li');
        this.cards.invoke('removeClassName','off');
        this.formField.removeClassName('valid');
        if(result.card_type){
            this.cards.invoke('addClassName','off');
            $$('.cards .' + result.card_type.name).invoke('removeClassName','off');
        }

        this.updateCardProxy(result);

        if(result.length_valid && result.luhn_valid){
            return this.formField.addClassName('valid');
        }else{
            return this.formField.removeClassName('valid');
        }
    },

    updateCardProxy: function(result){
        var cardProxy = $('ccsave_cc_type');
        $('ccsave_cc_type').value = '';
        if(result.card_type){
            cardProxy.value = result.card_type.short_code;
        }
    },

    convertToNumber: function(){
        if(Prototype.Browser.MobileSafari || (Prototype.Browser.WebKit && function(){
            try{
                document.createEvent('TouchEvent');
                return true;
            } catch(e) {
                return false;
            }
        })){
            $('card_number').writeAttribute('type','tel');
        }
    }

});

Event.observe(window, 'load', function () {

    creditCardValidation = new blueAcornValidateCreditCard($('card_number'));

}.bind(window));