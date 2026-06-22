import mock from '../../../shared/tests/mock.js';
import converse from '../../../../dist/converse.js';

const { u } = converse.env;

describe('XMPP URI Query Actions (XEP-0147) - MUC', function () {
    it(
        'opens a room when action=join',
        mock.initConverse(converse, ['chatBoxesFetched'], {}, async function (_converse) {
            const { api } = _converse;
            const originalHash = window.location.hash;
            const originalReplaceState = window.history.replaceState;

            window.history.replaceState = jasmine.createSpy('replaceState');
            const room_open_promise = Promise.resolve({});
            spyOn(api.rooms, 'open').and.returnValue(room_open_promise);

            // xmpp:theplay@chat.shakespeare.lit?join;nick=Mercutio
            window.location.hash =
                '#converse/action?uri=xmpp%3Atheplay%40chat.shakespeare.lit%3Fjoin%3Bnick%3DMercutio';

            try {
                await u.routeToQueryAction();
                expect(api.rooms.open).toHaveBeenCalledWith(
                    'theplay@chat.shakespeare.lit',
                    { nick: 'Mercutio' },
                    true
                );
            } finally {
                window.location.hash = originalHash;
                window.history.replaceState = originalReplaceState;
            }
        })
    );
});
