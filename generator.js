function generateInterface(name, inherits) {
  var generated_source = 'interface ' + name + (inherits ? ' ' + inherits : '') + ' {\n';

  $('.doclet').each(function(i, e){
  var $e = $(e);
  if($e.find('.crafty-method').length) return;
    var propertyName = $e.find('.doclet-header').text().trim();
    if(propertyName.length && propertyName[0] == '.') propertyName = propertyName.substr(1);
    if(!propertyName.trim().length) return;

    generated_source += '    '+propertyName+': any;\n';
  });

  $('.signature').each((i, e) => {
    var $e = $(e);
    var signature = $e.text();
    var tokens = signature.match(/([a-z0-9_\.]+)/gi);

    var visibility = tokens.shift();
    var returns = tokens.shift().toLowerCase();
    var methodName = tokens.shift();
    if(methodName[0] == '.')
      methodName = methodName.substr(1);

    var args = signature.split('(')[1].split(')')[0].trim();
    var args_signature = '';
    if(args != 'void')
        args_signature = args.replace(/(\.\.,\s+?([a-z0-9_\.]+)\s([a-z]+))/gi, '...$3: $2')
                             .replace(/\[\,\s+/gi,', [')
                             .replace(/\]/gi,'')
                             .replace(/\[(([a-z0-9_\.]+)\s([a-z0-9_]+))/gi, '$3?: $2')
                             .replace(/([a-z0-9_\.]+)\s([a-z0-9_]+)/gi, '$2: $1')
                             .replace(/\[/gi, '');
    generated_source += '    ' + methodName + '(' + args_signature + '): ' + (returns ? returns : 'void') + ';\n';
  });
  generated_source += '}';
  return generated_source;
}

$(function() {
    var $handler = $('.doc-page > h1');
    var interfaceName = $handler.text().replace(/\s/gi, '');
    $handler.append('&nbsp;<a href="#">Generate Interface</a>');
    $handler.find('a').click(function(e){
      e.preventDefault();
      var interfaceCode = generateInterface(interfaceName);
      var $doclet = $('.doclet').first();
      var $textarea = $doclet.find('textarea');
      if(!$textarea.length)
        $textarea = $doclet.prepend($('<textarea/>')).find('textarea');
      $textarea.css('width', '100%');
      $textarea.css('height', '250px');
      $textarea.text(interfaceCode);
    });
});
