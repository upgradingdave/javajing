package json.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Contact {

    Logger log = LoggerFactory.getLogger(Contact.class);

    private String firstName;
    private String lastName;
    private String email;

    public String getFirstName() {
        return firstName;
    }
     
    public void setFirstName(String firstName) {
        this.firstName = firstName
    }

    public String getLastName() {
        return lastName;
    }
     
    public void setLastName(String lastName) {
        this.lastName = lastName
    }

    public String getEmail() {
        return email;
    }
     
    public void setEmail(String email) {
        this.email = email
    }
}
