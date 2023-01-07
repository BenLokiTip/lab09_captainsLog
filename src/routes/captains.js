const express = require('express');

const { Captain } = require('../models/index');
const { ensureRole, checkToken } = require('../auth/router');

const captainRoutes = express();

captainRoutes.use(checkToken);

// RESTful Route Declarations
captainRoutes.get(
  '/captain',
  ensureRole(['reader', 'writer', 'editor', 'admin']),
  getCaptains
); // Retrieve All

captainRoutes.get(
  '/captain/:id',
  ensureRole(['reader', 'writer', 'editor', 'admin']),
  getCaptain
); // Retrieve One
captainRoutes.post('/captain', ensureRole(['writer', 'editor', 'admin']), createCaptain); // Create
captainRoutes.put('/captain/:id', ensureRole(['editor', 'admin']), updateCaptain); // Update
captainRoutes.delete('/captain/:id', ensureRole(['admin']), deleteCaptain); // Delete

async function getCaptains(req, res, next) {
  const allCaptains = await Captain.findAll();
  res.json(allCaptains);
}

async function getCaptain(req, res, next) {
  const id = req.params.id;
  const captain = await Captain.findOne({
    where: { id: id },
  });
  if (captain === null) {
    next();
  } else {
    const rawCaptain = {
      id: captain.id,
      name: captain.name,
      firstOfficer: captain.firstOfficer,
      ship: captain.ship,
    };
    res.json(rawCaptain);
  }
}

async function deleteCaptain(req, res, next) {
  const id = req.params.id;
  const captain = await Captain.findOne({ where: { id: id } });
  if (captain === null) {
    next();
  } else {
    await captain.destroy();
    res.json({});
  }
}

async function createCaptain(req, res, next) {
  const name = req.body.name;
  const firstOfficer = req.body.firstOfficer;
  const ship = req.body.ship;
  const captain = await Captain.create({
    name,
    firstOfficer,
    ship,
  });

  res.json(captain);
}

async function updateCaptain(req, res, next) {
  const id = req.params.id;
  let captain = await Captain.findOne({ where: { id: id } });
  if (captain == null) {
    next();
  } else {
    const name = req.body.name ?? captain.name;
    const firstOfficer = req.body.firstOfficer ?? captain.firstOfficer;
    const ship = req.body.ship ?? captain.ship;
    let updatedCaptain = {
      name,
      firstOfficer,
      ship,
    };

    captain = await Captain.update(updatedCaptain);

    res.json(captain);
  }
}

module.exports = {
  captainRoutes,
};