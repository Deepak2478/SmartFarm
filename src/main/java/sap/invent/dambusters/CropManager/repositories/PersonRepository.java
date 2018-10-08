package sap.invent.dambusters.CropManager.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import sap.invent.dambusters.CropManager.entities.Person;

@Repository
public interface PersonRepository extends CrudRepository<Person, Integer>{
	
}
