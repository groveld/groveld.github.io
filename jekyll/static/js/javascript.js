---
layout:
---
{% include js/jquery.min.js %}
{% include js/bootstrap.min.js %}
{% include js/headroom.min.js %}
{% include js/formValidation/formValidation.min.js %}
{% include js/formValidation/bootstrap.min.js %}

$(document).ready(function() {
  new Headroom(document.querySelector(".navbar"), {
    tolerance: {
      down : 10,
      up : 20
    },
    offset : 100
  }).init();

  $('#contactForm')
    .formValidation({
      icon: {
        required: 'fa fa-asterisk',
        valid: 'fa fa-check',
        invalid: 'fa fa-times',
        validating: 'fa fa-spin fa-refresh'
      },
      fields: {
        name: {
          validators: {
            notEmpty: {
              message: 'The name is required'
            }
          }
        },
        phone: {
          validators: {
            regexp: {
              message: 'The phone number can only contain the digits, spaces, -, (, ), + and .',
              regexp: /^[0-9\s\-()+\.]+$/
            }
          }
        },
        email: {
          validators: {
            notEmpty: {
              message: 'The email address is required'
            },
            emailAddress: {
              message: 'The input is not a valid email address'
            }
          }
        },
        subject: {
          validators: {
            stringLength: {
              max: 255,
              message: 'The subject must be less than 255 characters long'
            }
          }
        },
        message: {
          validators: {
            notEmpty: {
              message: 'The message is required'
            },
            stringLength: {
              max: 700,
              message: 'The message must be less than 700 characters long'
            }
          }
        }
      }
    })
    .on('err.field.fv', function(e, data) {
      data.element
        .data('fv.messages')
        .find('.help-block[data-fv-for="' + data.field + '"]')
        .hide();
    })
    .on('success.form.fv', function(e) {
      e.preventDefault();

      var $form = $(e.target);

      $('#alertContainer')
        .removeClass('alert-info')
        .removeClass('alert-danger')
        .addClass('alert-info')
        .html('Sending email...')
        .show();

      $.ajax({
        url: '{{ site.baseurl }}/static/php/sendmail.php',
        type: 'POST',
        data: $form.serialize(),
        dataType: 'json',
        success: function(response) {
          $form.formValidation('resetForm', false);

          response.result === 'error'
            ? $('#alertContainer')
              .removeClass('alert-info')
              .removeClass('alert-success')
              .addClass('alert-danger')
              .html('Sorry, cannot send the message')
              .show()
            : $('#alertContainer')
              .removeClass('alert-info')
              .removeClass('alert-danger')
              .addClass('alert-success')
              .html('Your message has been successfully sent')
              .show();

        }
      });
    });

  function replaceAllWords(newWord) {
    for (var i = 0; i < document.childNodes.length; i++) {
      checkNode(document.childNodes[i]);
    }
    function checkNode(node) {
      var nodeName = node.nodeName.toLowerCase();
      if(nodeName === 'script' || nodeName === 'style') {return;}
      if (node.nodeType === 3) {
        var text = node.nodeValue;
        var newText = text.replace(/\b\w+/g, newWord);
        node.nodeValue = newText;
      }
      if (node.childNodes.length > 0) {
        for (var j = 0; j < node.childNodes.length; j++) {
          checkNode(node.childNodes[j]);
        }
      }
    }
  }
  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
  $(document).keydown(function(e) {
    kkeys.push( e.keyCode );
    if ( kkeys.toString().indexOf( konami ) >= 0 ) {
      $(document).unbind('keydown',arguments.callee);
      replaceAllWords("alpaca");
    }
  });

});
