//import { HM3ActiveEffect } from './hm3-active-effect.js';

/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning document which manages this effect
 */
export async function onManageActiveEffect(event, owner) {
    event.preventDefault();    

    const a = event.currentTarget;
    const li = a.closest("li");
    const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;

    if (!effect && a.dataset.action !== "create") return;

    switch (a.dataset.action) {
        case "create": {
            const dlgTemplate = "systems/hm3/templates/dialog/active-effect-start.html";

            const dialogData = {
                gameTime: game.time.worldTime
            };

            if (game.combat) {
                dialogData.combatId = game.combat.id;
                dialogData.combatRound = game.combat.round;
                dialogData.combatTurn = game.combat.turn;
            }

            const html = await foundry.applications.handlebars.renderTemplate(
                dlgTemplate,
                dialogData
            );

            // Create the dialog window
            return Dialog.prompt({
                title: "Select Start Time",
                content: html,
                label: "OK",
                callback: async (html) => {
                    const form = html.querySelector("#active-effect-start");
                    const fd = new foundry.applications.ux.FormDataExtended(form);
                    const formdata = fd.object;
                    const startType = formdata.startType;

                    const aeData = {
                        name: "New Effect",
                        icon: "icons/svg/aura.svg",
                        origin: owner.uuid,
                        duration: {
                            units: "seconds",
                            value: null,
                            expiry: null
                        },
                        start: ActiveEffect.getEffectStart(game.combat)
                    };

                    if (startType === "nowGameTime") {
                        aeData.duration = {
                            units: "seconds",
                            value: 1,
                            expiry: null
                        };

                        aeData.start = {
                            time: dialogData.gameTime,
                            combat: null,
                            combatant: null,
                            initiative: null,
                            round: null,
                            turn: null
                        };
                    }
                    else if (startType === "nowCombat") {
                        aeData.duration = {
                            units: "rounds",
                            value: 1,
                            expiry: "turnStart"
                        };

                        aeData.start = {
                            time: dialogData.gameTime,
                            combat: dialogData.combatId,
                            combatant: game.combat?.combatant?.id ?? null,
                            initiative: game.combat?.combatant?.initiative ?? null,
                            round: dialogData.combatRound,
                            turn: dialogData.combatTurn
                        };
                    }

                    return ActiveEffect.create(aeData, { parent: owner });                    
                },
                options: { jQuery: false }
            }).catch(error => {
                if (error?.message === "The Dialog was closed without a choice being made.") {
                    return null;
                }

                throw error;
            });
        }

        case "edit":
            return effect.sheet.render(true);

        case "delete":
            return effect.delete();

        case "toggle": {
            const updateData = {
                disabled: !effect.disabled
            };

            if (effect.disabled) {
                updateData["start.time"] = game.time.worldTime;

                if (game.combat) {
                    updateData["start.combat"] = game.combat.id;
                    updateData["start.combatant"] = game.combat.combatant?.id ?? null;
                    updateData["start.initiative"] = game.combat.combatant?.initiative ?? null;
                    updateData["start.round"] = game.combat.round;
                    updateData["start.turn"] = game.combat.turn;
                } else {
                    updateData["start.combat"] = null;
                    updateData["start.combatant"] = null;
                    updateData["start.initiative"] = null;
                    updateData["start.round"] = null;
                    updateData["start.turn"] = null;
                }
            }

            return effect.update(updateData);
        }        

            const updateData = {};

            if (effect.disabled) {
                updateData.disabled = false;
                updateData["duration.startTime"] = game.time.worldTime;

                if (game.combat) {
                    updateData["duration.startRound"] = game.combat.round;
                    updateData["duration.startTurn"] = game.combat.turn;
                }
            } else {
                updateData.disabled = true;
            }            

            try {
                const result = await effect.update(updateData);

                return result;
            } catch (error) {                
                throw error;
            }
        }
    }
