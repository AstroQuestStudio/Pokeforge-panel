import React, { useEffect, useState } from 'react';
import { Button } from '@/components/elements/button/index';
import Can from '@/components/elements/Can';
import { ServerContext } from '@/state/server';
import { PowerAction } from '@/components/server/console/ServerConsoleContainer';
import { Dialog } from '@/components/elements/dialog';
import classNames from 'classnames';
import {
    PlayIcon,
    ArrowPathIcon,
    StopIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';

interface PowerButtonProps {
    className?: string;
}

export default ({ className }: PowerButtonProps) => {
    const [open, setOpen] = useState(false);
    const status = ServerContext.useStoreState((state) => state.status.value);
    const instance = ServerContext.useStoreState((state) => state.socket.instance);

    const killable = status === 'stopping';
    
    const onButtonClick = (
        action: PowerAction | 'kill-confirmed',
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): void => {
        e.preventDefault();
        if (action === 'kill') {
            return setOpen(true);
        }

        if (instance) {
            setOpen(false);
            instance.send('set state', action === 'kill-confirmed' ? 'kill' : action);
        }
    };

    useEffect(() => {
        if (status === 'offline') {
            setOpen(false);
        }
    }, [status]);

    const buttonBaseClasses = classNames(
        'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg',
        'font-medium text-sm',
        'transition-all duration-200 ease-out',
        'border',
        'active:scale-95'
    );

    return (
        <div className={classNames('flex gap-2', className)}>
            <Dialog.Confirm
                open={open}
                hideCloseIcon
                onClose={() => setOpen(false)}
                title="Forcibly Stop Process"
                confirm="Kill Process"
                onConfirmed={onButtonClick.bind(this, 'kill-confirmed')}
            >
                <p className="text-neutral-300">
                    Forcibly stopping a server can lead to data corruption. Only use this if the server is unresponsive.
                </p>
            </Dialog.Confirm>
            
            <Can action="control.start">
                <button
                    className={classNames(
                        buttonBaseClasses,
                        'flex-1',
                        status !== 'offline'
                            ? 'bg-neutral-700/50 border-neutral-600/50 text-neutral-500 cursor-not-allowed'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10'
                    )}
                    disabled={status !== 'offline'}
                    onClick={onButtonClick.bind(this, 'start')}
                >
                    <PlayIcon className="w-4 h-4" />
                    <span>Start</span>
                </button>
            </Can>
            
            <Can action="control.restart">
                <button
                    className={classNames(
                        buttonBaseClasses,
                        'flex-1',
                        !status
                            ? 'bg-neutral-700/50 border-neutral-600/50 text-neutral-500 cursor-not-allowed'
                            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    )}
                    disabled={!status}
                    onClick={onButtonClick.bind(this, 'restart')}
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Restart</span>
                </button>
            </Can>
            
            <Can action="control.stop">
                <button
                    className={classNames(
                        buttonBaseClasses,
                        'flex-1',
                        status === 'offline'
                            ? 'bg-neutral-700/50 border-neutral-600/50 text-neutral-500 cursor-not-allowed'
                            : killable
                            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10'
                    )}
                    disabled={status === 'offline'}
                    onClick={onButtonClick.bind(this, killable ? 'kill' : 'stop')}
                >
                    {killable ? (
                        <>
                            <XMarkIcon className="w-4 h-4" />
                            <span>Kill</span>
                        </>
                    ) : (
                        <>
                            <StopIcon className="w-4 h-4" />
                            <span>Stop</span>
                        </>
                    )}
                </button>
            </Can>
        </div>
    );
};
