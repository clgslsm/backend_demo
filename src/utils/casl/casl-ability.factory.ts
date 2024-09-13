import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Action, Role } from 'src/shared/roles.enum';

// casl-guard.ts

export class UserDTO {
  id: number;
  nickname: string;
  age: number;
  avatar: string;
}
export class Article {
  id: number;
  title: string;
  content: string;
}

type Subjects =
  | InferSubjects<typeof Article | typeof User | typeof UserDTO>
  | 'all';
export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === Role.ADMIN) {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, Article);
    }
    can(Action.Read, UserDTO, { id: user.id });
    can(Action.Update, UserDTO, { id: user.id });
    cannot(Action.Delete, UserDTO, { id: user.id });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
