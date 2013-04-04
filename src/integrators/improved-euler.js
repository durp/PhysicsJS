(function(){

    var defaults = {

        // 1 means vacuum
        // 0.001 means molasses
        drag: 0.9995
    };
    
    Physics.integrator('improved-euler', function( options, instance ){

        // cache some vector instances
        // so we don't need to recreate them in a loop
        var vel = Physics.vector()
            ;

        options = Physics.util.extend({}, defaults, options);

        return {

            integrate: function( dt, bodies ){

                // half the timestep
                var halfdt = 0.5 * dt
                    ,drag = options.drag
                    ,body = null
                    ,state
                    ;

                for ( var i = 0, l = bodies.length; i < l; ++i ){

                    body = bodies[ i ];

                    // only integrate if the body isn't fixed
                    if ( !body.fixed ){

                        state = body.state;

                        // Inspired from https://github.com/soulwire/Coffee-Physics
                        // @licence MIT
                        // 
                        // x += (v * dt) + (a * 0.5 * dt * dt)
                        // v += a * dt

                        // Store previous location.
                        state.old.pos.clone( state.pos );

                        // Scale force to mass.
                        // state.acc.mult( body.massInv );

                        // Duplicate velocity to preserve momentum.
                        vel.clone( state.vel );

                        // Update velocity first so we can reuse the acc vector.
                        // a *= dt
                        // v += a ...
                        state.vel.vadd( state.acc.mult( dt ) );

                        // Update position.
                        // ...
                        // oldV *= dt
                        // a *= 0.5 * dt
                        // x += oldV + a
                        state.pos.vadd( vel.mult( dt ) ).vadd( state.acc.mult( halfdt ) );

                        // Apply "air resistance".
                        if ( drag ){

                            state.vel.mult( drag );
                        }

                        // Reset accel
                        state.acc.zero();

                    }                    
                }
            }
        };
    });

}());
