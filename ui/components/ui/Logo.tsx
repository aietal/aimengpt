export function Logomark(props:any) {
    return (
      <svg
        viewBox="-17.325 -17.5 35 35"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        {...props}
      >
        <g transform="translate(-9.86315914027474 -9.9) scale(0.2286655162328319)" id="icon">
          <g>
            <path d="M85.413 42.707C85.413 19.12 66.292 0 42.706 0 19.119 0 0 19.12 0 42.707c0 .059.004.118.004.177H0v18.99l.044.981c.935 13.687 19.673 24.609 42.662 24.609s41.727-10.923 42.663-24.609l.044-.647V42.884h-.005c0-.059.005-.118.005-.177zm-7.604 15.155v2.096c0 10.268-15.809 18.59-35.306 18.59-19.499 0-35.306-8.322-35.306-18.59v-.937V47.699c0-9.454 7.663-17.119 17.118-17.119h36.374c9.455 0 17.12 7.665 17.12 17.119v10.163z" />
            <path d="M59.17 34.187H25.837c-8.663 0-15.685 5.828-15.685 13.02v9.313c0 11.322 14.482 14.153 32.351 14.153 17.868 0 32.351-3.081 32.351-14.153v-4.743-4.57c0-7.192-7.024-13.02-15.684-13.02zM18.894 54.389a2.423 2.423 0 1 1 0-4.846 2.423 2.423 0 0 1 0 4.846zm8.989-4.192a6.242 6.242 0 0 1 0-12.484 6.24 6.24 0 0 1 6.24 6.241 6.241 6.241 0 0 1-6.24 6.243z" />
          </g>
        </g>
      </svg>
    );
  }
  
  export function Logo(props:any) {
    return (
      <div className="flex items-center">
        <svg viewBox="0 0 40 40" aria-hidden="true" {...props}>
          <Logomark width="40" height="40" className="fill-primary" />
        </svg>
        <span className="text-gray-900 font-semibold text-xl"> IsaacGPT </span>
      </div>
    );
  }
  