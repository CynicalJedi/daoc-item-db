var lookup = {};
var metadata;
var currItem;
var mdjson= $.getJSON( "db/DAOC Item DB Metadata.json", function(data) {
  metadata = Object.assign(data);
  //console.log("metadata success");
})

//Checks status of radio buttons and determines what display type to use
function customDisplay(item) {
 // $('#item').html(
  var d = $('input[name=display]:checked', '#displayOptions').val();
  if (d == "json"){
    showRawJSON(item)
  }
  else if (d == "text") {
    showCustomText(item)
  }
  else {
    showGameDelve(item)
  }
}

//Show the display as the JSON from the db
function showRawJSON(item) {
	$('#item').html('<h3>'+item.name + '</h3>'+JSON.stringify(item, null, "<p/>")); //This dumps the raw json
}

//Show the display as a custom text version
function showCustomText(item) {
  $('#item').html('<h3>'+item.name + '</h3>'+ prettyPrint(item).replace(/(?:\r\n|\r|\n)/g, '<br/>'));
}

//Show the in-game delve of the item
function showGameDelve(item) {
  $('#item').html('<h3>'+item.name + '</h3>'+ item.delve_text.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
  }

//Returns a string representing the item
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
    var abilities = item.abilities; // List of /uses and item abilities
    var type_data = item.type_data; // has sub elements

    var sources = item.sources; //has sub type
    var bonus_level = item.bonus_level;
    var delve_text = item.delve_text;

    var requirements = item.requirements;

    //Table format
    //ID | Name | Realm | Category | Slot | Damage Type |

    var item_string = "Name:" + name + "\nID:" + id + "\nRealm:"+ metadata.realm[realm] + "\nCategory:" + metadata.categories[category];
    if (slot)
    {
      item_string = item_string + "\nSlot:" + metadata.slot[slot]
    }

    var hasReq = false;
    if (requirements)
      {
        if (requirements.level_required)
          {
            item_string = item_string + "\nRequired Level: " + requirements.level_required
            hasReq = true;
          }

          if (requirements.champion_level_required)
            {
              item_string = item_string + "\n Required Champion Level: " + requirements.champion_level_required
              hasReq = true;
            }
        
          if (requirements.usable_by)
            {
              item_string = item_string + "\nUsable by: "
              $.each(requirements.usable_by, function(key, value){
                item_string = item_string + metadata.requirements.usable_by[value] + " ";
              }); 
            }
      }

    if(type_data) {
      var dps = type_data.dps;
      var clamped_dps = type_data.clamped_dps;
      var speed = type_data.speed;
      var damage_type = type_data.damage_type;
      var base_quality = type_data.base_quality;
      var two_handed = type_data.two_handed;
      var left_handed = type_data.left_handed;
      var shield_size = type_data.shield_size;
      var armor_factor = type_data.armor_factor
      var clamped_armor_factor = type_data.clamped_armor_factor
      var absorption = type_data.absorption

      if (dps) {
        item_string = item_string + "\nDPS: " + dps;
      }

      if (clamped_dps) {
        item_string = item_string + "\nClamped DPS: " + clamped_dps ;
      }

      if (speed) {
        item_string = item_string + "\nSpeed: " + speed;
      }

      if (damage_type) {
        item_string = item_string + "\n Damage Type: " + metadata.damage_type[damage_type];
      }

      if (armor_factor) {
        item_string = item_string + "\n Armor Factor: " + armor_factor;
      }

      if (clamped_armor_factor) {
        item_string = item_string + "\n Clamped Armor Factor: " + clamped_armor_factor;
      }

      if (absorption) {
        item_string = item_string + "\nArmor Type: " + metadata.absorption[absorption] + " (" + absorption +" ABS)";
      }

      if (base_quality) {
        item_string = item_string + "\nQuality:" + base_quality;
      }

      if (shield_size) {
          item_string = item_string + "\n" + metadata.shield_size[shield_size] + " Shield";
        }

      if (two_handed) {
        item_string = item_string + "\nTwo Handed Weapon";
      }

      if (left_handed) {
        item_string = item_string + "\nEquiptable in Left Hand";
      }

    }

    if (bonuses)
    {
      $.each(bonuses, function(key, value){
        var val = value.value;
        var type = value.type;
        var id = value.id;
        //console.log("Val: "+ val + " Type:" + type + " ID: "+ id);
        //console.log(metadata.bonus_types[type]);
        //console.log(metadata.bonus_types[type].sub_types[id]);

        if (type == 28 && id >= 0){
        var s = metadata.bonus_types[type].id[id];
        }
        else if (id >= 0 ) {
        var s = metadata.bonus_types[type].sub_types[id];
        }
        else {
          var s = "";
        }
        item_string = item_string + "\n" + metadata.bonus_types[type].name ;
        if (s){
        item_string = item_string + ":"+ s ;
        }
        item_string = item_string + ":" + val; 
      });  
    }

    if (abilities) {
      $.each(abilities, function(key, value){
        // "spell": 3464,
        // "position": 1,
        // "max_charges": 30,
        // "magic_type": 6
        var spellID = value.spell;
        var charges = value.max_charges;
        var magicType = value.magic_type;
        var pos = value.position;
        //console.log("Spell ID:" + spellID + " Charges:" + charges + " type:" + magicType);
        if (spellID)
          {
            item_string = item_string + "\n" + metadata.abilities.magic_type[magicType] + ":" + metadata.abilities.spell[spellID];

            if (charges) {
              item_string = item_string + " Charges:" + charges + " Use:" + metadata.abilities.position[pos];
            }
          }
      }); 
    }

    if (bonus_level && !hasReq) {
      item_string = item_string + "\nBonus Level:" + bonus_level;
    }
    return item_string
}

$(document).ready(function(){
 $.ajaxSetup({ cache: true });
 var timer;
 
 //build list of all items and index based on item ID
   $.getJSON('db/static_objects.json', function(data) {
   $.each(data.items, function(key, value){
	 lookup[value.id] = value;
	 //console.log(value.id)
   });   
  });

 $('#search').keyup(function(e){
  if(e.which == 13) {
    return; //Dont do anything if the key was Enter, Enter handling is below in the keypress function
  }

   clearTimeout(timer);
   var ms = 300; // milliseconds
   var val = this.value;
   timer = setTimeout(function() {
  $('#result').html('');
  var searchField = $('#search').val();
  var expression = new RegExp(searchField, "i");

   $.each(lookup, function(key, value){
    if (value.name.search(expression) != -1 || value.id == searchField)
    {
     $('#result').append('<li><span>'+value.id+' | ' +value.name+' | ' + metadata.realm[value.realm] + '</span></li>');
    }
   });   

 }, ms);
});

$('#search').keypress(function(e) {
  if(e.which == 13) {
      var searchField = $('#search').val();
      var expression = new RegExp(searchField, "i");
      var ctr = 0;
      var last;
       $.each(lookup, function(key, value){
        if (value.name.search(expression) != -1 || value.id == searchField)
        {
          ctr++;
          last = value.id;
          //$('#result').append('<li><span>'+value.id+' | ' +value.name+' | ' + metadata.realm[value.realm] + '</span></li>');
        }
       });
      if (ctr == 1) {
        currItem = lookup[Number(last)];
        customDisplay(currItem);
        $('#search').val($.trim(currItem.name));
        $("#result").html('');
      }
  }
});

$('#displayOptions input').on('change', function() {
  if (currItem) {
    customDisplay(currItem);
  }
});

 $('#result').on('click', 'li', function() {
  var click_text = $(this).text().split('|');
  $('#search').val($.trim(click_text[1]));
  $("#result").html('');
  currItem = lookup[Number(click_text[0])]
  customDisplay(currItem);
 });

});