/*-----------------------------------------------
//////////////// vk.com/d2jscripts //////////////
/////////////////////////////////////////////////
Авто Ульт на Лину.
Автор: vk.com/elite_for_227
/////////////////////////////////////////////////
-----------------------End---------------------*/

var interval = 0.3
var damage = [400,600,720]
var scepterdamage = [570,710,890]
var manacost = [280,420,680]
var rangeCast = 900

// Баффы и ДеБаффы
var IgnoreBuffs = [
	"modifier_abaddon_borrowed_time",
	"modifier_brewmaster_primal_split",
	"modifier_omniknight_repel",
	"modifier_phoenix_supernova_hiding",
	"modifier_tusk_snowball_movemEnemyEntity",
	"modifier_tusk_snowball_movemEnemyEntity_friendly",
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
	["modifier_bloodseeker_bloodrage", [1.25, 1.3, 1.35, 1.4]],
	["modifier_ursa_enrage", 0.2],
]

var BuffsAbsorbMagicDmg = [
	["modifier_item_pipe_barrier", 400],
	["modifier_item_hood_of_defiance_barrier", 400],
	["modifier_item_infused_raindrop", 120],
	["modifier_abaddon_aphotic_shield", [110, 140, 170, 200]],
	["modifier_ember_spirit_flame_guard", [50, 200, 350, 500]]
]
var BuffsAddMagicDmgForMe = [
	["modifier_bloodseeker_bloodrage", [1.25, 1.3, 1.35, 1.4]]
]



function LinaF(){
if ( !Lina.checked )
		return
	var Me = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID())
	var Ulti = Entities.GetAbility(Me, 3)
	var UltiLvl = Abilities.GetLevel(Ulti)

    //Линза
	if (Game.GetAbilityByName(Me, 'item_aether_lens') != -1) {
	    Lense = true
	    rangeCast += 200
	}else
	    Lense = false
	

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
	    entPos = Entities.GetAbsOrigin(ent)
		cast = true
		if(ent==Me)
			continue	
		
		if (Game.PointDistance(entPos,MyPos) >  rangeCast) {
			cast = false
		}
		if (cast) {
		    var buffsnames = Game.GetBuffsNames(ent)
		    if (!Entities.IsEnemy(ent) || Entities.IsMagicImmune(ent) || !Entities.IsAlive(ent) || Game.IntersecArrays(buffsnames, IgnoreBuffs) || Entities.GetAllHeroEntities().indexOf(ent) == -1)
		        continue

		    var MagicResist = Entities.GetArmorReductionForDamageType(ent, 2) * 100
		    var buffs = Game.GetBuffs(ent)
		    for (m in buffs)
		        for (k in DebuffsAddMagicDmg)
		            if (Buffs.GetName(ent, buffs[m]) === DebuffsAddMagicDmg[k][0])
		                if (Array.isArray(DebuffsAddMagicDmg[k][1]))
		                    UltiDmg *= DebuffsAddMagicDmg[k][1][Abilities.GetLevel(Buffs.GetAbility(ent, buffs[i])) - 1]
		                else
		                    UltiDmg *= DebuffsAddMagicDmg[k][1]
		    var buffsme = Game.GetBuffs(Me)
		    for (m in buffsme)
		        for (k in BuffsAddMagicDmgForMe)
		            if (Buffs.GetName(ent, buffsme[m]) === BuffsAddMagicDmgForMe[k][0])
		                if (Array.isArray(BuffsAddMagicDmgForMe[k][1]))
		                    UltiDmg *= BuffsAddMagicDmgForMe[k][1][Abilities.GetLevel(buffsme.GetAbility(ent, buffsme[i])) - 1]
		                else
		                    UltiDmg *= BuffsAddMagicDmgForMe[k][1]
		    for (m in buffs)
		        for (k in BuffsAbsorbMagicDmg)
		            if (Buffs.GetName(ent, buffs[m]) === BuffsAbsorbMagicDmg[k][0])
		                if (Array.isArray(BuffsAbsorbMagicDmg[k][1]))
		                    UltiDmg -= BuffsAbsorbMagicDmg[k][1][Abilities.GetLevel(buffs.GetAbility(ent, buffs[i])) - 1]
		                else
		                    UltiDmg -= BuffsAddMagicDmgForMe[k][1]

		    if (Lense)
		        UltiDmg = UltiDmg * 1.05


		    var dmgclear = UltiDmg - UltiDmg / 100 * MagicResist

			var HP = Entities.GetHealth(ent)
			if (HP <= dmgclear) {
				GameUI.SelectUnit(Me, false);
				Game.CastTarget(Me, Ulti,ent,false)
				$.Msg(HP, '<', dmgclear)
			}
			cast = false
		}
	}
	}
var LinaOnCheckBoxClick = function(){
	if ( !Lina.checked ){
		Game.ScriptLogMsg('Script disabled: Lina', '#ff0000')
		return
	}
	if ( Players.GetPlayerSelectedHero(Game.GetLocalPlayerID()) != 'npc_dota_hero_lina' ){
		Lina.checked = false
		Game.ScriptLogMsg('Lina: Not Lina', '#ff0000')
		return
	}
	function f(){ $.Schedule( interval,function(){
		LinaF()
		if(Lina.checked)
			f()
	})}
	f()
	Game.ScriptLogMsg('Script enabled: Lina', '#00ff00')
}

// Новый шаблон
var Lina = Game.AddScript(1, "Lina", LinaOnCheckBoxClick)