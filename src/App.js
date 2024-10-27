import React, { useState, useEffect } from "react";
import "./App.css";
import TableComponent from "./TableComponent";

const endpoint = "https://cc-web-api-v11.azurewebsites.net/fuelStation";

const emptyItem = {
  name: "",
  description: "",
  address: "",
  openHours: "",
  price: "",
  rateDate: getCurrentDate(),
  parking: false
  // paymentMethods: ["Cash"],
};

function generateEmpty() {
  return { ...emptyItem };
}

function getCurrentDate() {
  return formatDate(new Date());
}

export function formatDate(date) {
  if (!date) {
    return "";
  }
  console.log(typeof date);
  if (!(date instanceof Date)) {
    try {
      date = new Date(date);
    } catch (exc) {
      console.error(exc);
      return "";
    }
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
}

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(generateEmpty());
  const [editing, setEditing] = useState(false);

  // Function to fetch items from the local API
  const fetchFuelStations = async () => {
    try {
      const response = await fetch(endpoint);
      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const fuelStations = await response.json();

      setItems(fuelStations.map(station => {
        return {
          ...station,
          rateDate: station.rate_date,
          openHours: station.open_hours
        }
      }));
      console.log(fuelStations);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  // Fetch items from the local API on component mount
  useEffect(() => {
    fetchFuelStations();
  }, []); // Empty dependency array means this runs once on mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });

    setFormData({ ...formData, [name]: value });
  };

  const upsertStation = async (newStation) => {
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(newStation),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      console.log(response)
      const errorDetails = await response.json();
      console.log(errorDetails)
      throw new Error("Network response was not ok");
    }

    const item = await response.json();
    
    return {...item, rateDate: item.rate_date,
      openHours: item.open_hours};
  };

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const newStation = await upsertStation({ ...formData });
      setItems([...items, newStation]);
      setFormData(generateEmpty());
      console.log(newStation);
    } catch (exc) {
      console.error(exc);
    }
  };

  const editItem = (item) => {
      setEditing(true);
      setFormData(item);
  };

  const updateItem = async (e) => {
    e.preventDefault();
    try {
      await upsertStation(formData);
      setItems(items.map((item) => (item.id === formData.id ? formData : item)));
      setEditing(false);
      setFormData(generateEmpty());

    }
    catch(exc){
      console.log(exc);
    }
  };

  const deleteServer = async (id) => {
    const response = await fetch(`${endpoint}/${id}`, {
      method: "DELETE",
    });
    return response;
  };

  const deleteItem = async (id) => {
    const response = await deleteServer(id);
    if (!response.ok) {
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  // const handleSelectChange = (e) => {
  //   const options = e.target.options;
  //   const valueArray = [];

  //   // Loop through selected options and add them to valueArray
  //   for (let i = 0; i < options.length; i++) {
  //     if (options[i].selected) {
  //       valueArray.push(options[i].value);
  //     }
  //   }

  //   // Update the state with the selected languages
  //   setFormData({ ...formData, paymentMethods: valueArray });
  //   console.log("selection changed");
  // };

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: e.target.checked });
  };

  return (
    <div className="App">
      <h1>Fuel Stations</h1>

      <form onSubmit={editing ? updateItem : addItem}>
        <div className="input-container">
          <label className="input-label asterix">*</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <div className="input-container">
          <label className="input-label asterix">*</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-container">
          <div className="label-container">
            <div className="asterix">*&nbsp;</div>
            <div className="font-size-12">HH:mm-HH:mm</div>
          </div>
          <input
            type="text"
            name="openHours"
            placeholder="Open Hours"
            value={formData.openHours}
            onChange={handleInputChange}
            pattern="^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\s*-\s*(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$"
            required
          />
        </div>

        <div className="input-container">
          <label className="input-label asterix">*</label>
          <input
            type="number"
            name="price"
            placeholder="Diesel price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-container">
          <div className="label-container">
            <div className="asterix">*&nbsp;</div>
            <div className="font-size-12">Pricing Date</div>
          </div>
          <input
            type="date"
            name="rateDate"
            value={
              formData.rateDate
                ? formatDate(formData.rateDate)
                : getCurrentDate()
            }
            onChange={handleInputChange}
          />
        </div>

        {/* <div className="input-container">
          <div className="label-container">
            <div className="asterix">*&nbsp;</div>
            <div className="font-size-12">Payment Methods</div>
          </div>
          <select
            className="paymentMethods"
            name="paymentMethods"
            multiple
            value={formData.paymentMethods}
            onChange={handleSelectChange}
            required
          >
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div> */}

        <div className="input-container">
          <label className="input-label">24/7 Parking</label>
          <input
            type="checkbox"
            name="parking"
            checked={formData.parking}
            onChange={handleCheckboxChange}
          />
        </div>

        <button type="submit">
          {editing ? "Update Station" : "Add Station"}
        </button>
      </form>

      {/* Use the itemTable component and pass necessary props */}
      <TableComponent items={items} onEdit={editItem} onDelete={deleteItem} />
    </div>
  );
}

export default App;
