var metadata;
var mdjson= $.getJSON( "db/DAOC Item DB Metadata.json", function(data) {
  metadata = Object.assign(data);
  console.log("metadata success");
})

console.log(metadata);
console.log("test");

//Matches the metadata fields to a human readable string
function lookupMeta(item) {
  $.getJSON('db/DAOC Item DB Metadata.json', function(data) {
    $.each(data.items, function(key, value){
	 //save.push(value);
	 lookup[value.id] = value;
	 //console.log(value.id)
   });   
  });
 
  
    return item_string
}

function showRawJSON(item) {
	$('#item').html('<h3>'+item.name + '</h3>'+JSON.stringify(item, null, "<p/>")); //This dumps the raw json
}

//TODO -- This is NOT finished, more needs to be parsed and included from the JSON object
//Returns an HTML table representing the item
function prettyPrint(item) {
    var name = item.name;
    var id = item.id;
    var category = item.category;
    var realm = item.realm;
    var slot = item.slot;
    var icon = item.icon;
    var material = item.material;
    var salvage_amount = item.salvage_amount;
    var artifact = item.artifact;
    var dye_type = item.dye_type;

    var flags = item.flags; //has sub elements
    if (flags)
    {
    var no_sell = flags.nosell;
    var emblemizable = flags.emblemizable;
    var dyable = flags.dyable;
    }

    var bonuses = item.bonuses; // this has a sub type

    var type_data = item.type_data; // has sub elements
    if(type_data)
    {
    var dps = type_data.dps;
    var clamped_dps = type_data.clamped_dps;
    var speed = type_data.speed;
    var damage_type = type_data.damage_type;
    var base_quality = type_data.base_quality;
    var two_handed = type_data.two_handed;
    var left_handed = type_data.left_handed;
    }
    var sources = item.sources; //has sub type
    var bonus_level = item.bonus_level;
    var delve_text = item.delve_text;

    //Table format
    //ID | Name | Realm | Category | Slot | Damage Type |

    var item_string = "Name:" + name + "\nID:" + id + "\nRealm:"+ metadata.realm[realm] + "\nCategory:" + metadata.categories[category];
    if (slot)
    {
      item_string = item_string + "\nSlot:" + metadata.slot[slot]
    }

    if (bonuses)
    {
      $.each(bonuses, function(key, value){
        //console.log(key);
        //console.log("TEST")
       // console.log(metadata.bonus_types);
        var val = value.value;
        var type = value.type;
        var id = value.id;
        console.log("Val: "+ val + " Type:" + type + " ID: "+ id);
        //console.log(metadata.bonus_types[type]);
        //console.log(metadata.bonus_types[type].sub_types[id]);
        //metadata.bonus_types[1].sub_types[0]
        if (type == 28) {
        var s = metadata.bonus_types[type].id[id];
        console.log(s);
        }
        else {
        var s = metadata.bonus_types[type].sub_types[id];
        console.log(s);
        }
        item_string = item_string + "\n" + metadata.bonus_types[type].name +":" + s + ":" + val; 
      });  
    }
  
    return item_string
}

//var save = new Array();
var lookup = {};

$(document).ready(function(){
 $.ajaxSetup({ cache: true });
 var timer;
 
 //build list of all items and index based on item ID
   $.getJSON('db/daoc item database.json', function(data) {
   $.each(data.items, function(key, value){
	 //save.push(value);
	 lookup[value.id] = value;
	 //console.log(value.id)
   });   
  });
 
 $('#search').keyup(function(){
   clearTimeout(timer);
   var ms = 300; // milliseconds
   var val = this.value;
   timer = setTimeout(function() {
  $('#result').html('');
  $('#state').val('');
  var searchField = $('#search').val();
  var expression = new RegExp(searchField, "i");

   $.each(lookup, function(key, value){
    if (value.name.search(expression) != -1)
    {
     $('#result').append('<li><span>'+value.id+' | ' +value.name+' | ' + metadata.realm[value.realm] + '</span></li>');
	 //save.push(value);
	 //lookup[value.id] = value;
    }
   });   

 }, ms);
});
 
 $('#result').on('click', 'li', function() {
  var click_text = $(this).text().split('|');
  $('#search').val($.trim(click_text[1]));
  $("#result").html('');
  var r = lookup[Number(click_text[0])]
  //$('#item').html('<h3>'+r.name + '</h3>'+JSON.stringify(r, null, "<br/>")); //This dumps the raw json
  $('#item').html('<h3>'+r.name + '</h3>'+ r.delve_text.replace(/(?:\r\n|\r|\n)/g, '<br />'));
 });
});