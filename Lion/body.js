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
