import { HM3 } from './config.js';

export class HM3ActiveEffectConfig extends foundry.applications.sheets.ActiveEffectConfig {

    /** @override */
    async _renderChange(context) {
        const { change, index } = context;

        // Foundry V14 converts non-string values to JSON strings for rendering.
        if (("value" in change) && (typeof change.value !== "string")) {
            change.value = JSON.stringify(change.value);
        }

        // Create the same field paths used by Foundry V14.
        Object.assign(
            change,
            ["key", "type", "value", "phase", "priority"].reduce((paths, fieldName) => {
                if (fieldName in change) {
                    paths[`${fieldName}Path`] = `system.changes.${index}.${fieldName}`;
                }
                return paths;
            }, {})
        );

        const changeType = foundry.documents.ActiveEffect.CHANGE_TYPES[change.type];
        context.changeType = changeType;

        // HârnMaster Attribute Key choices.
        context.keyChoices = HM3.activeEffectKey;

        return foundry.applications.handlebars.renderTemplate(
            "systems/hm3/templates/effect/active-effect-change.html",
            context
        );
    }
}
