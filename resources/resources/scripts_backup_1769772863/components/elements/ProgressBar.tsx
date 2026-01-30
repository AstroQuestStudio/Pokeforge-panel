import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { randomInt } from '@/helpers';
import { CSSTransition } from 'react-transition-group';

type Timer = ReturnType<typeof setTimeout>;

export default () => {
    const interval = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const timeout = useRef<Timer>(null) as React.MutableRefObject<Timer>;
    const [visible, setVisible] = useState(false);
    const progress = useStoreState((state) => state.progress.progress);
    const continuous = useStoreState((state) => state.progress.continuous);
    const setProgress = useStoreActions((actions) => actions.progress.setProgress);

    useEffect(() => {
        return () => {
            timeout.current && clearTimeout(timeout.current);
            interval.current && clearInterval(interval.current);
        };
    }, []);

    useEffect(() => {
        setVisible((progress || 0) > 0);

        if (progress === 100) {
            timeout.current = setTimeout(() => setProgress(undefined), 500);
        }
    }, [progress]);

    useEffect(() => {
        if (!continuous) {
            interval.current && clearInterval(interval.current);
            return;
        }

        if (!progress || progress === 0) {
            setProgress(randomInt(20, 30));
        }
    }, [continuous]);

    useEffect(() => {
        if (continuous) {
            interval.current && clearInterval(interval.current);
            if ((progress || 0) >= 90) {
                setProgress(90);
            } else {
                interval.current = setTimeout(() => setProgress((progress || 0) + randomInt(1, 5)), 500);
            }
        }
    }, [progress, continuous]);

    return (
        <div className="w-full fixed top-0 left-0 right-0 z-[9999]" style={{ height: '3px' }}>
            <CSSTransition timeout={150} appear in={visible} unmountOnExit classNames="fade">
                <div
                    className={classNames(
                        'h-full rounded-r-full',
                        'bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400',
                        'shadow-lg shadow-cyan-500/30',
                        'transition-all duration-300 ease-out'
                    )}
                    style={{
                        width: progress === undefined ? '100%' : `${progress}%`,
                        boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.2)',
                    }}
                />
            </CSSTransition>
        </div>
    );
};
