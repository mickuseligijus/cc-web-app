import React from "react";
import "./TableComponent.css"; 
import {formatDate} from "./App.js"
const TableComponent = ({ items, onEdit, onDelete }) => {
  return (
    <table border="1" style={{ width: "100%", textAlign: "left" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Address</th>
          <th>Open Hours</th>
          <th>Diesel Price</th>
          <th>Rate Date</th>
          {/* <th>Payment Methods</th> */}
          <th>24/7 Parking</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>{item.address}</td>
            <td>{item.openHours}</td>
            <td>{item.price}</td>
            <td>{formatDate(item.rateDate)}</td>
            {/* <td>
              <ul>
                {item.paymentMethods?.map((payment) => {
                  return <li>{payment}</li>;
                })}
              </ul>
            </td> */}
            <td>{item.parking ? "Yes" : "No"}</td>
            <td className="actions">
              <button onClick={() => onEdit(item)}>Edit</button>
              <button onClick={() => onDelete(item.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
