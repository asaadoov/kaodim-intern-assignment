// modules used
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

// Server Configuration
const app = express();
const PORT = process.env.PORT || 2098;

app.use(cors());

// mySQL connection
const kaodimSqlDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ASad*2152592164",
  database: "kaodim_sql"
});

kaodimSqlDB.connect(error => {
  if (error) return console.log(error);
});

// Add job Request
app.get("/jobrequest/add", (req, res) => {
  const { email, date, location } = req.query || {
    email: "a@test.com",
    date: "2019-05-01",
    location: "Mont Kiara"
  };

  // INSERT query
  const INSERT_JOBREQUEST = `INSERT INTO jobrequest(userEmail,location,jobDate) VALUES("${email}","${location}", "${date}");`;

  kaodimSqlDB.query(INSERT_JOBREQUEST, (error, results) => {
    if (error) return res.send(error);
    else {
      checkMatch(date, location);
      console.log(results);
      return res.send("successfully inserted job request");
    }
  });
});

// check for match
function checkMatch(date, location) {
  // UPDATE queries
  kaodimSqlDB.query(
    "SELECT DISTINCT jobrequest.jobRequestId , vendors.vendorName FROM vendors,jobrequest WHERE vendors.location=jobrequest.location AND vendors.availability=jobrequest.jobDate;",
    (err, results) => {
      if (err) console.log(err);
    }
  );
  kaodimSqlDB.query(
    "UPDATE vendors,jobrequest SET vendors.jobAssigned = jobrequest.jobRequestId WHERE vendors.location=jobrequest.location AND vendors.availability=jobrequest.jobDate;",
    (err, result) => {
      if (err) console.log(err);
    }
  );
  kaodimSqlDB.query(
    "UPDATE vendors, jobrequest SET jobrequest.vendorAssigned = vendors.vendorName WHERE vendors.location=jobrequest.location AND vendors.availability=jobrequest.jobDate;",
    (err, result) => {
      if (err) console.log(err);
    }
  );
}

getSummary = () => {
  const SELECT_SUMMARY = `
    SELECT DISTINCT vendorId,vendorName,userEmail, jobrequest.location, jobDate,jobAssigned , vendorAssigned
    FROM vendors, jobrequest
    WHERE vendors.location=jobrequest.location AND vendors.availability=jobrequest.jobDate ORDER BY jobDate;`;

  kaodimSqlDB.query(SELECT_SUMMARY, (error, results) => {
    if (error) console.log(error);
    else console.table(results);
  });
};

app.get("/", (req, res) => res.redirect("http://localhost:3000"));

app.listen(PORT, () => {
  console.log(`The Server is running on PORT ${PORT}...`);
});
