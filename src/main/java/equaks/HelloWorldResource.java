package equaks;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

/**
 * Created by jsska on 27.03.2014.
 */

@Path("/world")
public class HelloWorldResource {

    @GET
    @Produces(MediaType.TEXT_HTML)
    public String sayHtmlHello(){
        return "Hello, hello!";
    }

    @PUT
    @Produces(MediaType.TEXT_HTML)
    public String putSomething(){
        return "You tried to put";
    }

    @DELETE
    @Produces(MediaType.TEXT_HTML)
    public String deleteSomething(){
        return "You tried to delete something";
    }

    @POST
    @Produces(MediaType.TEXT_HTML)
    public String postSomething(){
        return "You tried to post something";
    }

}
