//АВТО УЛЬТА НА НЕКРОМАНА
//Автор vk.com/elite_for_227
//Группа проекта - https://vk.com/d2jscripts
//////////END/////////////



var interval = 0.1
var damage = [0.6, 0.75, 0.9]
var aganimdamage = [0.6, 0.9, 1.2]
var LenseBonusRange = 200
var rangeCast = 500

function AutoUltNecrophos(){
	var MyEnt = parseInt( Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID()) )
	var Ulti = Entities.GetAbilityByName(MyEnt, 'necrolyte_reapers_scythe' )
	var UltiRange = Abilities.GetCastRange( Ulti )
	
	//проверяем наличие линзы
	if(Entities.HasItemInInventory( MyEnt, 'item_aether_lens'))
		UltiRange+=LenseBonusRange
	var UltiLvl = Abilities.GetLevel(Ulti)
	var UltiCd = Abilities.GetCooldownTimeRemaining( Ulti )
	var UltiDmg = Abilities.GetAbilityDamage(Ulti)
	var UltiManaCost = Abilities.GetManaCost(Ulti)
	var dmg = damage[UltiLvl-1]
	if(Entities.HasItemInInventory( MyEnt, 'item_ultimate_scepter')) dmg = aganimdamage[UltiLvl-1]
	
	if(UltiLvl==0 || UltiCd > 0 || UltiManaCost > Entities.GetMana(MyEnt)) return		

	var HEnts = Game.PlayersHeroEnts()
	for (i in HEnts) {
		var ent = parseInt(HEnts[i])
		if(Entities.HasItemInInventory(ent, 'item_sphere')) {
			var sphere = Game.GetAbilityByName(ent, 'item_sphere')

			if (Abilities.GetCooldownTimeRemaining(sphere)-2 <= 0) continue
		}
		if( !Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent) || Entities.IsInvisible(ent)) continue
			
		var Range = Entities.GetRangeToUnit(MyEnt, ent)
		if(Range>UltiRange || Range<200) continue

		var enemyhp = Entities.GetHealth(ent)
		var enemymaxhp = Entities.GetMaxHealth(ent)
		var MagicResist = Entities.GetArmorReductionForDamageType( ent, 2 )*100

		var calcdamge = (enemymaxhp-enemyhp)*dmg
		$.Msg(enemyhp, enemymaxhp, dmg)

		var clearDamage = calcdamge - calcdamge/100*MagicResist

		if (enemyhp > clearDamage) continue
			
		GameUI.SelectUnit(MyEnt,false)
		Game.CastTarget(MyEnt, Ulti, ent, false)
	}	
}

var AutoUltNecrophosOnCheckBoxClick = function(){
	if ( !AutoUltNecrophos.checked ){
		Game.Panels.AutoUltNecrophos.DeleteAsync(0)
		Game.ScriptLogMsg('Script disabled: AutoUltNecrophos', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_necrolyte' ){
		AutoUltNecrophos.checked = false
		Game.ScriptLogMsg('AutoUltNecrophos: Not Nercophos', '#ff0000')
		return
	}

	function maincheck(){ $.Schedule( interval,function(){
		AutoUltNecrophos()
		if(AutoUltNecrophos.checked)
			maincheck()
	})}
	maincheck()
	Game.ScriptLogMsg('Script enabled: AutoUltNecrophos', '#00ff00')
}

var AutoUltNecrophos = Game.AddScript(1, "AutoUltNecrophos", AutoUltNecrophosOnCheckBoxClick)
