import { _converse, api } from '@converse/headless';
import log from '@converse/log';

export function calculateViewportHeightUnit () {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

/**
 * Handle XEP-0147 "query actions" for chatboxes (both 1:1 and MUC).
 * This function is called by the chatview plugin's routeToQueryAction.
 * Handles:
 *   - No action: opens a chat
 *   - message: opens a chat and prefills the composer
 *
 * @param {string} jid - The JID to open a chat with
 * @param {URLSearchParams} query_params - Query parameters from the URI
 */
export async function routeToQueryAction(jid, action, query_params) {

    if (!action) {
        // No action specified, just open the chat
        return api.chats.open(jid);
    }

    if (action === 'message') {
        await handleMessageAction(jid, query_params);
    } else {
        // Other actions are not handled by this plugin
        log.debug(`routeToQueryAction (chatboxviews): Action "${action}" not handled`);
    }
}

/**
 * Handles the `message` querytype.
 * Opens a chat and optionally prefills the message composer.
 *
 * @param {string} jid - The JID to send a message to
 * @param {URLSearchParams} params - Query parameters including 'body'
 */
async function handleMessageAction(jid, params) {
    const body = params.get('body') || '';
    const chat = await api.chats.open(jid);

    if (!chat) {
        return;
    }

    if (body) {
        await chat.save({ draft: body });
    }

    const view = _converse.state.chatboxviews?.get(jid);
    const textarea = view?.querySelector('.chat-textarea');
    if (textarea) {
        textarea.focus();
    }
}
