const InfoCard = (props) => {
    const { info, tokenAmount } = props;

    return (
        <div className="py-8 px-8 max-w-sm mx-auto rounded-xl space-y-2 sm:py-16 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 shadow-slate-50/40 gradient-border shadow-inner">
          <div className="text-center space-y-2">
            <div className="space-y-0.5">
              <p className="text-lg text-white font-semibold uppercase">
                {info}
              </p>
              <p className="text-orange-600 font-extrabold text-3xl">
                {tokenAmount}
              </p>
            </div>
          </div>
        </div>
    )
}

export default InfoCard;