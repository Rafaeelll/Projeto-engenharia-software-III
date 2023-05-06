import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import '../../styles.css'
import HeaderBar from '../../components/ui/HeaderBar';

export default function CriarAgendas() {
  const [date, setDate] = useState(new Date());
  const prevMonth = () => {
    const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const today = new Date();
    const lastAllowedMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prevMonthDate >= lastAllowedMonthDate) {
      setDate(prevMonthDate);
    }
    else{
      alert("Seleciona somente datas futuras")
    }
  };
  
  const nextMonth = () => {
    const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const today = new Date();
    const lastAllowedMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    if (nextMonthDate <= lastAllowedMonthDate.setMonth(lastAllowedMonthDate.getMonth() + 12)) {
      setDate(nextMonthDate);
    }
    else{
      alert("Seleciona somente datas futuras")
    }
  };
  

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const monthDays = [];
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  for (let i = 1; i <= lastDay.getDate(); i++) {
    monthDays.push({ date: new Date(date.getFullYear(), date.getMonth(), i), id: i });
  }

  const startBlank = Array(firstDay.getDay()).fill(null);
  const endBlank = Array(6 - lastDay.getDay()).fill(null);
  const days = [...startBlank, ...monthDays, ...endBlank];

  return (
    <div style={{backgroundSize: "cover", backgroundPosition: "center", height: "100vh", justifyContent: "center", background: 'whitesmokesss'}}className='Papai'>
      <div>
        <HeaderBar/>
      </div>
      <div className="header2">
        <div className="month">
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
            <div className="arrows">
              <button style={{
                color: '#fff', 
                fontWeight: 'bold', 
                background: 'purple', 
                borderRadius: '5px', 
                fontSize: '15px',
                fontFamily: 'monospace',
                padding: '5px 10px', 
                margin: '2px', 
                marginTop: '100px',
                cursor: 'pointer',
                border: 'none'}} onClick={prevMonth}>{"<"}
              </button>
              <button style={{
                color: '#fff', 
                fontWeight: 'bold', 
                background: 'purple', 
                borderRadius: '5px',
                fontSize: '15px',
                fontFamily: 'monospace',
                padding: '5px 10px',
                marginTop: '100px', 
                margin: '2px', 
                border: 'none',
                cursor: 'pointer'
              }} onClick={nextMonth}>{">"}
            </button>
          </div>
      </div>
        <div className="calendar">
            <div className="weekdays">
              {weekdays.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>

            <div className="days">
              {days.map((day, index) => (
                <div key={day?.id ?? index} className={day ? 'day' : 'blank'}>{day ? day.date.getDate() : ''}</div>
              ))}
            </div>      
        </div>
    </div>
  );
}