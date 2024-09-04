
create table "user"
(
    id       serial
        constraint "PK_cace4a159ff9f2512dd42373760"
            primary key,
    username varchar                                       not null
        constraint "UQ_78a916df40e02a9deb1c4b75edb"
            unique,
    password varchar                                       not null,
    role     user_role_enum default 'user'::user_role_enum not null
);

alter table "user"
    owner to postgres;


create table detail
(
    id          serial
        constraint "PK_28de27ee9ae6103af88ab1b3c0c"
            primary key,
    description varchar not null,
    "userId"    integer
        constraint "REL_e83149aca9ac7b7eedbad3ac43"
            unique
        constraint "FK_e83149aca9ac7b7eedbad3ac43d"
            references "user"
);

alter table detail
    owner to postgres;

insert into public.user (id, username, password, role)
values  (1, 'testuser', '$2b$10$AHIrltBRLJlvD6yknKOBF.EDFni.IYEy/VQBSYW0lSpprSn7V15Y6', 'user'),
        (2, 'root', '$2b$10$HyZJ5If6NddkY1bZAzSVU.94xbSzMmH9UDauRxcrrzWB5S0HaUyQe', 'admin'),
        (3, 'user1', '$2b$10$aRngmwM8e3ialZNgHoHtpuUstcrJTKingUksDCY1zUsdxlPnOdlSG', 'user'),
        (4, 'user2', '$2b$10$dSB/gV1a01Nj45TsQqUEj.jX.QxbNnu1FEuFaRy58j0ElTqT.bIIS', 'user'),
        (5, 'user3', '$2b$10$KotdV4GcjhXNEg8UB2w0T.Gj0JybK/fkvjWaD2ZE2jlfQP3lAVjoe', 'user'),
        (6, 'user4', '$2b$10$DOFfq7PTb1L/YRbCfhLW9.eNf2eqC.6CJKJ0iBg8pe4lXAFxWww.S', 'user');

insert into public.detail (id, description, userId)
values  (1, 'I''m admin', 2),
        (2, 'I''m user', 1),
        (3, 'I''m 1st user', 3),
        (4, 'I''m 2nd user', 4),
        (5, 'I''m 3rd user', 5),
        (6, 'I''m 4th user', 6);
