/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Авто Ульт на Лиона.
Автор: vk.com/elite_for_227
/////////////////////////////////////////////////
-----------------------End---------------------*/

var interval = 0.3
var damage = [490,600,720]
var scepterdamage = [570,710,890]
var manacost = [200,420,625]
var rangeCast = 900
var debug = false

var IgnoreBuffs = [
	"modifier_abaddon_borrowed_time",
	"modifier_brewmaster_primal_split",
	"modifier_omniknight_repel",
	"modifier_phoenix_supernova_hiding",
	"modifier_tusk_snowball_movement",
	"modifier_tusk_snowball_movement_friendly",
	"modifier_juggernaut_blade_fury",
	"modifier_medusa_stone_gaze",
	"modifier_nyx_assassin_spiked_carapace",
	"modifier_templar_assassin_refraction_absorb",
	"modifier_oracle_false_promise",
	"modifier_dazzle_shallow_grave",
	"modifier_treant_living_armor",
	"modifier_life_stealer_rage",
	"modifier_item_aegis"
]

var DebuffsAddMagicDmg = [
	["modifier_bloodthorn_debuff", 1.3],
	["modifier_orchid_malevolence_debuff", 1.3],
	["modifier_item_mask_of_madness_berserk", 1.25],
	["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]],
	["modifier_ursa_enrage", 0.2],
]

var BuffsAbsorbMagicDmg = [
	["modifier_item_pipe_barrier", 400],
	["modifier_item_hood_of_defiance_barrier", 400],
	["modifier_item_infused_raindrop", 120],
	["modifier_abaddon_aphotic_shield", [110,140,170,200]],
	["modifier_ember_spirit_flame_guard", [50,200,350,500]]
]

var BuffsAddMagicDmgForMe = [
	["item_aether_lens", 1.05],
	["modifier_bloodseeker_bloodrage", [1.25,1.3,1.35,1.4]]

function LionF(){
if ( !Lion.checked )
		return
	var Me = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Ulti = Entities.GetAbility(Me, 3)
	var UltiLvl = Abilities.GetLevel(Ulti)
	if(UltiLvl==0)
		return
	if ( Abilities.GetCooldownTimeRemaining(Ulti) != 0 || Entities.GetMana(Me)<manacost[UltiLvl-1] )
		return
	if (!Entities.HasScepter(Me))
		var UltiDmg = damage[UltiLvl-1]
	else
		var UltiDmg = scepterdamage[UltiLvl-1]
	MyPos = Entities.GetAbsOrigin(Me)
	var HEnts = Game.PlayersHeroEnts()
	for (i in HEnts) {
		ent = HEnts[i]
		cast = true
		if(ent==Me)
			continue	
		if ( !Entities.IsEnemy(ent) || !Entities.IsAlive(ent) || Entities.GetAllHeroEntities().indexOf(ent)==-1 )
			continue
		entPos = Entities.GetAbsOrigin(ent)
		if (Game.PointDistance(entPos,MyPos) >  rangeCast) {
			cast = false
		}
		if (cast){
			var HP = Entities.GetHealth(ent)
			if ( HP <= UltiDmg ){
				GameUI.SelectUnit(Me, false);
				Game.CastTarget(Me, Ulti,ent,false)
				$.Msg(HP,'<',UltiDmg)
			}
			cast = false
		}
	}
	}
var LionOnCheckBoxClick = function(){
	if ( !Lion.checked ){
		Game.ScriptLogMsg('Script disabled: Lion', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_lion' ){
		Lion.checked = false
		Game.ScriptLogMsg('Lion: Not Lion', '#ff0000')
		return
	}
	function f(){ $.Schedule( interval,function(){
		LionF()
		if(Lion.checked)
			f()
	})}
	f()
	Game.ScriptLogMsg('Script enabled: Lion', '#00ff00')
}
var Temp = $.CreatePanel( "Panel", $('#scripts'), "Lion" )
Temp.SetPanelEvent( 'onactivate', LionOnCheckBoxClick )
Temp.BLoadLayoutFromString( '<root><styles><include src="s2r://panorama/styles/dotastyles.vcss_c" /><include src="s2r://panorama/styles/magadan.vcss_c" /></styles><Panel><ToggleButton class="CheckBox" id="Lion" text="Lion"/></Panel></root>', false, false)  
var Lion = $.GetContextPanel().FindChildTraverse( 'Lion' ).Children()[0]
