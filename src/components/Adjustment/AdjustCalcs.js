import React from 'react';

const AdjustCalcs = () => {

    const calcAdjustmentByYear = (coefficient, year) => {
        return coefficient * year
    }

    return (
        <div className="row">
            <h1>
                <h2>محاسبات تعدیل صورت حساب</h2>
            </h1>
            <div className="row"><label className="form-label">
                ضریب
            </label>
                <input className="form-control"/></div>
            <div className="row"><label className="form-label">
                سال
            </label>
                <input className="form-control"/>
            </div>
            <button className="btn btn-primary btn-sm"
                    onClick={() => calcAdjustmentByYear(2024,0.3)}
            >
                محاسبه
            </button>
        </div>
    );
};

export default AdjustCalcs;