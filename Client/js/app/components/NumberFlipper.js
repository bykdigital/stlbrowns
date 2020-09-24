
var Class = require('./oop/Class');

var $ = require('DOM');

var Ticker = Class({

  initialize: function() {

  }
});

module.exports = function(opts) {

  return new Ticer(opts);
};

(function(){
  
  //Returns random number between minVal and maxVal.
  Math.randomBtwn = function(minVal, maxVal) {
      return minVal + (Math.random() * (maxVal - minVal));
  };
  
  var numbers = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].join('\n');
  
  var num = '<span>' + numbers + '</span>';
  var tpl = '<div class="row row--top">' + num + num + '</div><div class="row row--bottom">' + num + num + '</div>';

  var ticker = {
    
    el: document.querySelector('.ticker'),
    startVal: 0,
    endVal: 0,
    
    init : function(el) {
      this.el = el;
      this.el.innerHTML = tpl;
      
      this.numbers = document.querySelectorAll('.ticker span');
    },
    
    tick : function(num) {
      
      for ( var i = 0, l = num.length; i < l; i ++ ) {
          this.numbers[i].style.transition = 'all 1000ms ' + i * 100 + 'ms cubic-bezier(0.230, 1.000, 0.320, 1.000)';
          this.numbers[i].style.transform = 'translateY(' + parseInt(num[i]) * -10 + '%)';
      }
            
    }
    
  };
  
  var el = document.querySelector('.ticker');
  ticker.init(el);
  
  var btn = document.getElementById('button');
  btn.addEventListener('click', function(e) {
    
    e.preventDefault();
    var input = document.getElementById('year');
    var value = year.value;
    var arr = value.split('');
    ticker.tick(arr);
    
  });
  
})();