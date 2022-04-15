import React from 'react';
import { motion } from 'framer-motion';

export const ProgressBar = ({ progressLabels, index, setIndex }) => {
  return (
    <div className="w-6/12 bg-darkpurple rounded-full overflow-hidden shadow">
      <div className="flex row justify-around pointer-events-auto">
        {progressLabels.map((item, itemIndex) => (
          <div
            className={`relative flex items-center justify-center flex-1 h-14 hover:cursor-pointer`}
            key={item}
            onClick={() => setIndex(itemIndex)}
          >
            {index === itemIndex && (
              <motion.div
                className="absolute bg-red-500 h-full w-full rounded-full bg-sky-500"
                layoutId="progress-pill"
              ></motion.div>
            )}
            <div className="relative z-1">
              {/* {index > itemIndex ? (
                <Icon
                  className="m-auto"
                  path={mdiCheckBold}
                  size={2}
                  color={'cyan'}
                />
              ) : ( */}
              <p className="lg:text-3xl md:text-xl font-bold text-white ">
                {item}
              </p>
              {/* )} */}
            </div>
          </div>
        ))}
      </div>
      <div />
    </div>
  );
};
